import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Auth } from '../src/modules/auth/auth.entity';
import { AuthType } from '../src/modules/auth/auth.interface';
import { User } from '../src/modules/users/user.entity';
import { UserRole } from '../src/modules/users/users.interface';

export default class UserWithAuthSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = false;

  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const user = new User();
    user.firstName = '세호';
    user.lastName = '전';
    user.alias = 'sayho';
    user.role = UserRole.ADMIN;
    user.phone = '01029484648';

    const auth = new Auth(AuthType.EMAIL);
    auth.user = user;
    auth.email = 'fishcreek@naver.com';
    await auth.setPassword('test');

    user.auths = [auth];
    console.log(user);

    await userRepository.save([user]);

    // ---------------------------------------------------

    const userFactory = factoryManager.get(User);
    // save 1 factory generated entity, to the database
    await userFactory.save();

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5);
  }
}
