import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private usersService: UsersService,
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

    const { accessToken, refreshToken } = await this.createTokenPair(
      payload,
      secret,
    );

    console.log({ accessToken });

    return {
      user: payload,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async createTokenPair(payload, secret) {
    const accessToken = this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRE_AT,
      secret,
    });

    const refreshToken = this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRE_RT,
      secret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
