import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BlogsModule } from '../blogs/blogs.module';
import { BlogsService } from '../blogs/blogs.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
    AuthModule,
  ],
  providers: [NotificationGateway],
})
export class NotificationModule {}
