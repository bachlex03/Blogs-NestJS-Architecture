import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseSignupDto } from './dto/response-signup.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import {
  CustomApiBadRequestException,
  CustomForbiddenException,
} from 'src/common/decorators/api-swagger.decorator';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Auth')
@ApiSecurity('JWT-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Create a new
   */
  @Public()
  @Post('signup')
  @HttpCode(201)
  @ApiCreatedResponse({
    description:
      "Return token pair access token, refresh token with expired time of AT and user'roles",
    type: ResponseSignupDto,
  })
  @CustomApiBadRequestException('', 'email must be an email')
  @CustomForbiddenException('', 'User is registered !')
  signUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  /**
   * Client do action login
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'sample1@gmail.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      "Return token pair access token, refresh token with expired time of AT and user'roles",
    type: ResponseLoginDto,
  })
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  /**
   * Client do action logout
   */
  @Post('logout')
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(200)
  logout(@Req() req: Request) {
    return this.authService.logout(req.user);
  }

  /**
   * Client request new access token by refresh token
   */
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
        },
      },
    },
  })
  @Post('refresh')
  @Roles(Role.ADMIN, Role.USER)
  generateAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.requestAccessToken(refreshToken);
  }

  @Get('protected')
  @Roles(Role.ADMIN, Role.USER)
  getInfo(@Req() req: Request) {
    return req.user;
  }
}
