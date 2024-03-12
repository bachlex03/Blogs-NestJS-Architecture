import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Headers,
  Header,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/header.guard';
import { UUID } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signUp(registerUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Headers() header) {
    return this.authService.logout(header);
  }
}
