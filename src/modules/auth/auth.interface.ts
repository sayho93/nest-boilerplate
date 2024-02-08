import { Union } from '../../common/types/union.type';
import { UserRole } from '../users/users.interface';

export const AuthType = {
  EMAIL: 'email',
  GOOGLE: 'google',
  NAVER: 'naver',
  KAKAO: 'kakao',
};

export type AuthType = Union<typeof AuthType>;

export interface JwtPayload {
  authId: string;
  userId: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
