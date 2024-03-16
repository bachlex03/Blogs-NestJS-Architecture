import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { Headers } from 'src/constants';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private tokenService: TokenService,
    private mailerService: MailService,
  ) {}

  async signUp(registerUserDto: RegisterUserDto) {
    // 1. Checking exist email ?
    const user = await this.usersService.findOneByEmail(registerUserDto.email);

    if (user) {
      throw new BadRequestException('User is registered !');
    }

    // 2. hashing password
    registerUserDto.password = await bcrypt.hash(registerUserDto.password, 10);

    // 3. save
    const newUser = await this.usersService.create(registerUserDto);

    if (!newUser) {
      throw new BadRequestException("Can't register !");
    }

    // 4. generate accessToken and refreshToken using JWT
    const payload = {
      user_id: newUser.id,
      email: newUser.email,
    };

    // generate accessToken and refreshToken
    const { accessToken, refreshToken, expiredInAccessToken } =
      await this.createTokenPair(payload);

    await this.tokenService.create(newUser.email, {
      refreshTokenUsing: refreshToken,
    });

    // Send email
    // const token = Math.floor(1000 + Math.random() * 9000).toString();

    // await this.mailerService.sendUserConfirmation(savedUser, token);

    return {
      accessToken,
      refreshToken,
      expiredInAccessToken,
    };
  }

  async login(user: any) {
    // generate access token and refresh token
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken, expiredInAccessToken } =
      await this.createTokenPair(payload);

    await this.tokenService.create(user.email, {
      refreshTokenUsing: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
      expiredInAccessToken,
    };
  }

  async logout(user: any) {
    const { userId } = user;

    const deletedKeyToken = await this.tokenService.deleteByUserId(userId);

    return {
      deletedKeyToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...remain } = user;

      return remain as User;
    }

    return null;
  }

  async requestAccessToken(refreshToken: string) {
    // 1. check exist refreshToken?
    if (!refreshToken) {
      throw new BadRequestException('refreshToken missing!');
    }

    // 2. decode
    const decodeToken = await this.jwtService
      .verifyAsync(refreshToken)
      .catch(() => {
        throw new UnauthorizedException(
          'Timeout or invalid refreshToken. Please login again!',
        );
      });

    // 2. check refreshToken is used ? By Check refreshTokenUsed in db
    const foundedTokenUsed =
      await this.tokenService.findTokenUsed(refreshToken);

    console.log({
      foundedTokenUsed,
    });

    // 2.1 available refreshToken
    if (foundedTokenUsed) {
      // console.log({ decodeToken });

      const { userId } = decodeToken;

      // 2.2 delete refreshToken store in db
      const deletedToken = await this.tokenService.deleteByUserId(userId);

      // console.log({ deletedToken });

      // 2.3 finally throw error
      throw new UnauthorizedException(
        'Something went wrong! please login again.',
      );
    }

    // 3. check this refreshToken is truly using by this user
    const holderToken = await this.tokenService.findByTokenUsing(refreshToken);

    console.log({
      holderToken,
    });

    if (!holderToken) {
      throw new UnauthorizedException('Invalid token or not registered');
    }

    const holderUser = await this.usersService.findOneById(holderToken.user.id);

    // 4. generate new access
    const payload = {
      userId: holderUser.id,
      email: holderUser.email,
    };

    const { expiredInAccessToken, ...tokens } =
      await this.createTokenPair(payload);

    // 5. update new token
    holderToken.refreshTokenUsing = tokens.accessToken;
    holderToken.refreshTokenUsed.push(refreshToken);

    await this.tokenService.update(holderToken);

    return {
      ...tokens,
      expiredInAccessToken,
    };
  }

  async createTokenPair(payload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRE_AT,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRE_RT,
    });

    const expiredInAccessToken = this.jwtService.verify(accessToken).exp;

    return {
      accessToken,
      refreshToken,
      expiredInAccessToken,
    };
  }
}
