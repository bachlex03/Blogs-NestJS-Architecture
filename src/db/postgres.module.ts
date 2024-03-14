import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
  // exports: [TypeOrmModule.forRootAsync(dataSourceOptions)],
})
export class DatabaseModule {}
