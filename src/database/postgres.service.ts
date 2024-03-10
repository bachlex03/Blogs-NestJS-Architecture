import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

export const dbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'bale',
    password: '',
    database: 'todo',
    entities: [User],
    synchronize: true,
  }),
};

export const db: TypeOrmModuleAsyncOptions =
  TypeOrmModule.forRootAsync(dbConfig);
