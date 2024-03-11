import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

import config from '../../configs/env.config';
import { Auth } from '../auth/entities/auth.entity';

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
    entities: [User],
    synchronize: true,
  }),
};
