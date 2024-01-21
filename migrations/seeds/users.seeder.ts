import { UserRole, UsersEntity } from 'src/modules/users/entities/users.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { createHash } from '../../src/common/utils/encrypt';

export default class UserSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = false;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const repository = dataSource.getRepository(UsersEntity);
    const user = new UsersEntity();
    user.email = 'fishcreek@naver.com';
    user.name = '전세호';
    user.alias = 'sayho';
    user.password = await createHash('test');
    user.role = UserRole.ADMIN;
    user.phone = '01029484648';

    console.log(user, ':::::');
    await repository.insert([user]);

    // ---------------------------------------------------

    const userFactory = await factoryManager.get(UsersEntity);
    // save 1 factory generated entity, to the database
    await userFactory.save();

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5);
  }
}
