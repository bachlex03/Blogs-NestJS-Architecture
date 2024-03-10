import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';

import config from '../../configs/env.config';

const { HOST, PORT, USERNAME, DATABASE, PASSWORD } = config.postgres;

console.log({ fb: config });

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
