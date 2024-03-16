import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { DatabaseModule } from './db/postgres.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { MailService } from './modules/mail/mail.service';
import { EventsModule } from './modules/websocket/events.module';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    UsersModule,
    BlogsModule,
    AuthModule,
    DatabaseModule,
    TokenModule,
    MailModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
