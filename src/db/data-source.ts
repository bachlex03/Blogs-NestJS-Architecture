import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import config from '../configs/env.config';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';

import { MainSeeder } from './seeds/main.seeder';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({ path: '.env' });

const { HOST, PORT, USERNAME, DATABASE, PASSWORD } = config.postgres;

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: HOST,
  port: PORT,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  // entities: [__dirname + '/../**/*.entity.{js,ts}'],
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['src/db/migrations/*.js', 'dist/db/migrations/*{.ts,.js}'],
  synchronize: true,
  seeds: [MainSeeder],
};

export default new DataSource(dataSourceOptions);
