import { setSeederFactory } from 'typeorm-extension';
import { AuthType } from '../../src/modules/auth/auth.interface';
import { Auth } from '../../src/modules/auth/entities/auth.entity';
import { User } from '../../src/modules/users/entities/user.entity';

export const UserWithAuthFactory = setSeederFactory(User, async (faker) => {
  const firstName = faker.person.firstName('male');
  const lastName = faker.person.lastName('male');

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.phone = faker.helpers.fromRegExp(/010[0-9]{8}/);
  user.alias = faker.internet.displayName({ firstName, lastName });

  const auth = new Auth(AuthType.GOOGLE);
  auth.email = faker.internet.email();
  user.auths = [auth];
  console.log(user);

  return user;
});
