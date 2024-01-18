import { registerAs } from '@nestjs/config';
import { Redis } from '../configs.interface';

export const RedisConfig = registerAs(
  'Redis',
  (): Redis => ({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  }),
);
