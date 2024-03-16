import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { KeyTokenModule } from '../key-token/key-token.module';
import { MailModule } from '../mail/mail.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
    MailModule,
    UsersModule,
    KeyTokenModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
