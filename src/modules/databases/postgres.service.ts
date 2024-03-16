import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

import config from '../../configs/env.config';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { Token } from '../token/entities/token.entity';

dotenv.config({ path: '.env' });

console.log({ env: process.env.DEV_DB_DATABASE }); // {

const { HOST, PORT, USERNAME, DATABASE, PASSWORD } = config.postgres;

console.log({ DB: config });

export const dbConfig: TypeOrmModuleAsyncOptions & SeederOptions = {
  useFactory: () => ({
    type: 'postgres',
    host: HOST,
    port: PORT,
    username: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    entities: [User, Token],
    synchronize: true,
  }),
  seeds: [],
};
