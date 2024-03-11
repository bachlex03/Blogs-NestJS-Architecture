import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  signUp(@Body() registerUserDto: RegisterUserDto) {
    console.log({ registerUserDto });
    return this.authService.signUp(registerUserDto);
  }
}
