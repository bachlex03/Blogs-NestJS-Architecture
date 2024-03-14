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
    const { accessToken, refreshToken } = await this.createTokenPair(
      payload,
      secret,
    );

    const keyStore = await this.keyTokenService.create(savedUser.id, {
      refreshTokenUsing: refreshToken,
    });

    // Send email
    const token = Math.floor(1000 + Math.random() * 9000).toString();

    await this.mailerService.sendUserConfirmation(savedUser, token);

    return {
      user: payload,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // 1. check exist email?
    const user = await this.usersService.findOneByEmail(loginDto.email);

    console.log({ user });

    if (!user) {
      throw new BadRequestException('Invalid user!');
    }

    // 2. check password
    const isMatch = bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    // 3. generate access token and refresh token
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const secret = process.env.SECRET_KEY;

    const { accessToken, refreshToken } = await this.createTokenPair(
      payload,
      secret,
    );

    const keyToken = await this.keyTokenService.create(user.id, {
      refreshTokenUsing: refreshToken,
    });

    return {
      user: payload,
      tokens: {
        accessToken,
        refreshToken,
      },
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

  async createTokenPair(payload, secret) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRE_AT,
      secret,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRE_RT,
      secret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
