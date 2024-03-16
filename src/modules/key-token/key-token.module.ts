import { Module } from '@nestjs/common';
import { KeyTokenService } from './key-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyToken } from './entities/key-token.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([KeyToken]), UsersModule],
  providers: [KeyTokenService],
  exports: [KeyTokenService],
})
export class KeyTokenModule {}
