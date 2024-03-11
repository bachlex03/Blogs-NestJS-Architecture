import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() registerUserDto: RegisterUserDto) {
    console.log({ registerUserDto });
    return this.authService.signUp(registerUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log({ loginDto });
    return this.authService.login(loginDto);
  }
}
