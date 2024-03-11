import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { DatabaseModule } from './modules/database/postgres.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, BlogsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
