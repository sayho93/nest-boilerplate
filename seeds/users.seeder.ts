import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../src/modules/users/user.entity';
import { UserRole } from '../src/modules/users/users.interface';

export default class UserSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = false;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const repository = dataSource.getRepository(User);
    const user = new User();
    // user.email = 'fishcreek@naver.com';
    user.firstName = '세호';
    user.lastName = '전';
    user.alias = 'sayho';
    // user.password = await createHash('test');
    user.role = UserRole.ADMIN;
    user.phone = '01029484648';
    console.log(user);

    await repository.insert([user]);

    // ---------------------------------------------------

    const userFactory = factoryManager.get(User);
    // save 1 factory generated entity, to the database
    await userFactory.save();

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5);
  }
}
