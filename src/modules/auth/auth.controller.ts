import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signUp(registerUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user);
  }

  @Post('refresh')
  generateAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.requestAccessToken(refreshToken);
  }

  @Get('protected')
  @Roles(Role.ADMIN, Role.USER)
  getInfo(@Req() req: Request) {
    return req.user;
  }
}
