import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signUp(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('logout')
  // @UseGuards(AuthGuard)
  logout(@Headers() header) {
    return this.authService.logout(header);
  }
}
