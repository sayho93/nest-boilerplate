import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../src/modules/users/user.entity';

export const UserFactory = setSeederFactory(User, async (faker) => {
  const firstName = faker.person.firstName('male');
  const lastName = faker.person.lastName('male');

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.alias = faker.internet.displayName({ firstName, lastName });
  console.log(user);

  return user;
});
