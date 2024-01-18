import { App, Env } from '../configs.interface';
import * as process from 'node:process';
import { registerAs } from '@nestjs/config';

export const AppConfig = registerAs(
  'App',
  (): App => ({
    env: process.env.NODE_ENV as Env,
    serviceName: process.env.SERVICE_NAME,
    port: parseInt(process.env.DB_PORT),
  }),
);
