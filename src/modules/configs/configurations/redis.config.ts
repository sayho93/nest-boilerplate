import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { validateConfig } from './validation';

export class Redis {
  @IsString()
  host: string;

  @Type(() => Number)
  @IsNumber()
  port: number;

  @IsString()
  password: string;
}

export const RedisConfig = registerAs(Redis.name, (): InstanceType<typeof Redis> => {
  const config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  };

  return validateConfig(Redis, config);
});
