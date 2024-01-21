import { setSeederFactory } from 'typeorm-extension';
import { createHash } from '../../src/common/utils/encrypt';
import { UsersEntity } from '../../src/modules/users/entities/users.entity';

export default setSeederFactory(UsersEntity, async (faker) => {
  const firstName = faker.person.firstName('male');
  const lastName = faker.person.lastName('male');

  const user = new UsersEntity();
  user.name = `${firstName} ${lastName}`;
  user.alias = faker.internet.displayName({ firstName, lastName });
  user.email = faker.internet.email({ firstName, lastName });
  user.password = await createHash('test');

  console.log(user, ':::::2');

  return user;
});
