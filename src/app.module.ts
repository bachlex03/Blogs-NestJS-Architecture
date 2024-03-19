import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { DatabaseModule } from './db/postgres.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { MailService } from './modules/mail/mail.service';
import { TokenModule } from './modules/tokens/tokens.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guard/role.guard';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NotificationModule } from './modules/notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BlogsModule,
    DatabaseModule,
    TokenModule,
    MailModule,
    ProfilesModule,
    CommentsModule,
    NotificationModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MailService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
