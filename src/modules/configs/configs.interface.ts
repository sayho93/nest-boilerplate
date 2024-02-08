import { Algorithm } from 'jsonwebtoken';
import { App } from './configurations/app.config';
import { Mail } from './configurations/mail.config';
import { MariaDB } from './configurations/mariaDB.config';
import { Redis } from './configurations/redis.config';
import { KeyEqualsValueRecord } from '../../common/types/key-equals-value-record.type';
import { Union } from '../../common/types/union.type';

export const Env = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const;

export type Env = Union<typeof Env>;

export interface Configs {
  App: App;
  MariaDB: MariaDB;
  Redis: Redis;
  Mail: Mail;
  Firebase: object;
}

export type AlgorithmRecord = KeyEqualsValueRecord<Algorithm>;

export const JwtAlgorithm: AlgorithmRecord = {
  ES256: 'ES256',
  ES384: 'ES384',
  ES512: 'ES512',
  HS256: 'HS256',
  HS384: 'HS384',
  HS512: 'HS512',
  PS256: 'PS256',
  PS384: 'PS384',
  PS512: 'PS512',
  RS256: 'RS256',
  RS384: 'RS384',
  RS512: 'RS512',
  none: 'none',
};
