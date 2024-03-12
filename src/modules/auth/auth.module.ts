import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { KeyTokenModule } from '../key-token/key-token.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [JwtModule.register({}), MailModule, UsersModule, KeyTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
