import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { KeyTokenService } from '../key-token/key-token.service';
import { LoginDto } from './dto/login.dto';
import { Headers } from 'src/constants';
import { UUID } from 'crypto';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private keyTokenService: KeyTokenService,
    private mailerService: MailService,
  ) {}

  async signUp(registerUserDto: RegisterUserDto) {
    // 1. Checking exist email ?
    const user = this.usersService.findOneByEmail(registerUserDto.email);

    if (!user) {
      throw new BadRequestException('User not found !');
    }

    // 2. hashing password
    registerUserDto.password = await bcrypt.hash(registerUserDto.password, 10);

    // 3. save
    const savedUser = await this.usersService.create(registerUserDto);

    if (!savedUser) {
      throw new BadRequestException("Can't register !");
    }

    // 4. generate accessToken and refreshToken using JWT
    const payload = {
      user_id: savedUser.id,
      email: savedUser.email,
    };

    const secret = process.env.SECRET_KEY;

    // generate accessToken and refreshToken
    const { accessToken, refreshToken } = await this.createTokenPair(payload);

    const keyStore = await this.keyTokenService.create(savedUser.id, {
      refreshTokenUsing: refreshToken,
    });

    // Send email
    // const token = Math.floor(1000 + Math.random() * 9000).toString();

    // await this.mailerService.sendUserConfirmation(savedUser, token);

    return {
      user: payload,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async login(user: any) {
    const { email, password } = user;

    // 1. generate access token and refresh token
    const payload = {
      id: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken } = await this.createTokenPair(payload);

    await this.keyTokenService.create(user.id, {
      refreshTokenUsing: refreshToken,
    });
    return {
      token: accessToken,
    };
  }

  async logout(headers: any) {
    const userId = headers[Headers.CLIENT_ID];

    const deletedKeyToken = await this.keyTokenService.deleteByUserId(userId);

    console.log({
      deletedKeyToken,
    });

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

  async createTokenPair(payload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRE_AT,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRE_RT,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
