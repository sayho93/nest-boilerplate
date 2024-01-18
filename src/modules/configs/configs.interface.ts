import { Union } from '../../common/types/union.type';

export const Env = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const;

export type Env = Union<typeof Env>;

export interface App {
  env: Env;
  serviceName: string;
  port: number;
}

export interface MariaDB {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface Redis {
  host: string;
  port: number;
  password: string;
}

export interface Mail {
  service: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface Firebase {
  fcmServer: string;
  fcmConfig: string;

  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authURI: string;
  tokenURI: string;
  authProvider: string;
  clientCertURL: string;
}

export interface Configs {
  App: App;
  MariaDB: MariaDB;
  Redis: Redis;
  Mail: Mail;
  Firebase: Firebase;
}
