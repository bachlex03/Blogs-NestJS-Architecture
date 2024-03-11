import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

import config from '../../configs/env.config';
import { KeyToken } from '../key-token/entities/key-token.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

console.log({ env: process.env.DEV_DB_DATABASE }); // {

const { HOST, PORT, USERNAME, DATABASE, PASSWORD } = config.postgres;

console.log({ DB: config });

export const dbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: 'postgres',
    host: HOST,
    port: PORT,
    username: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    entities: [User, KeyToken],
    synchronize: true,
  }),
};
