import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig, db } from './postgres.service';

@Module({
  imports: [TypeOrmModule.forRootAsync(dbConfig)],
  exports: [TypeOrmModule.forRootAsync(dbConfig)],
})
export class DatabaseModule {}
