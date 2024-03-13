import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './data-source';

@Module({
  imports: [TypeOrmModule.forRootAsync(dbConfig)],
  // exports: [TypeOrmModule.forRootAsync(dbConfig)],
})
export class DatabaseModule {}
