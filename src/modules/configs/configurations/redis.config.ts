import { registerAs } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { validateConfig } from './validation';
import { Redis as IRedis } from '../configs.interface';

export class Redis implements IRedis {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  password: string;
}

export const RedisConfig = registerAs(Redis.name, () => {
  const config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  };

  return validateConfig(Redis, config);
});
