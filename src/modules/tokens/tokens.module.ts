import { Module } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Token } from './entities/token.entity';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UsersModule, PrismaModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
