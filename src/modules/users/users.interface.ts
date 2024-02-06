import { Union } from '../../common/types/union.type';

export const UserRole = {
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest',
};

export type UserRole = Union<typeof UserRole>;
