import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { DatabaseModule } from './modules/database/postgres.module';
import { AuthModule } from './modules/auth/auth.module';
import { KeyTokenModule } from './modules/key-token/key-token.module';

@Module({
  imports: [
    UsersModule,
    BlogsModule,
    AuthModule,
    DatabaseModule,
    KeyTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
