import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { KeyTokenService } from '../key-token/key-token.service';
import { SaveKeyTokenDto } from '../key-token/dto/save-key-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private keyTokenService: KeyTokenService,
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
      fullName: savedUser.fullName,
    };

    const secret = process.env.SECRET_KEY;

    // generate accessToken and refreshToken
    const { accessToken, refreshToken } = await this.createTokenPair(
      payload,
      secret,
    );

    const saveKeyTokenDto = new SaveKeyTokenDto();

    saveKeyTokenDto.user_id = savedUser.id;
    saveKeyTokenDto.refreshTokenUsing = refreshToken;

    const keyStore = await this.keyTokenService.create(saveKeyTokenDto);

    console.log({ keyStore });

    return {
      user: payload,
      tokens: {
        accessToken,
        refreshToken,
      },
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
