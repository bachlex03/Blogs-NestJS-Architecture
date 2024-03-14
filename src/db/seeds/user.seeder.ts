import { User } from 'src/modules/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  track?: boolean;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.query('TRUNCATE TABLE user;');

    console.log({
      message: 'Test',
    });

    const repository = dataSource.getRepository(User);

    await repository.insert({
      email: 'bach@gmail.com',
      password: '123',
    });
  }
}
