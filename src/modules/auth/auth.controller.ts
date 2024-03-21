import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpCode,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Request } from 'express';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { TokenResponse } from './dto/token-response.dto';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Auth')
@ApiSecurity('JWT-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Create a new user (done)
   */
  @Public()
  @Post('signup')
  @HttpCode(201)
  @ApiCreatedResponse({
    description:
      "Return token pair access token, refresh token with expired time of AT and user'roles",
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Email must be an email' })
  @ApiForbiddenResponse({ description: 'User is registered' })
  signUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  /**
   * Client do action login (done)
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description:
      "Return token pair access token, refresh token with expired time of AT and user'roles",
    type: TokenResponse,
  })
  @ApiBadRequestResponse({ description: 'Email must be an email' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'invalid credentials' })
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  /**
   * Client request new access token by refresh token (done)
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
  @ApiOkResponse({
    description:
      "Return token pair access token, refresh token with expired time of AT and user'roles",
    type: TokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('refresh')
  @Roles(Role.ADMIN, Role.USER)
  generateAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.requestAccessToken(refreshToken);
  }

  /**
   * Client do action logout (done)
   */
  @Get('logout')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ description: 'Logout successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  logout(@Req() req: Request) {
    const { userId } = req.user as any;

    return this.authService.logout(userId);
  }
}
