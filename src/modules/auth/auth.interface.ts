import { Union } from '../../common/types/union.type';

export const AuthType = {
  EMAIL: 'email',
  GOOGLE: 'google',
  NAVER: 'naver',
  KAKAO: 'kakao',
};

export type AuthType = Union<typeof AuthType>;
