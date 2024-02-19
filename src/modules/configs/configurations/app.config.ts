import * as process from 'process';
import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Algorithm } from 'jsonwebtoken';
import { validateConfig } from './validation';
import { Env, JwtAlgorithm } from '../configs.interface';

export class App {
  @IsEnum(Env)
  env: Env;

  @Type(() => Number)
  @IsNumber()
  port: number;

  @IsString()
  serviceName: string;

  @IsString()
  jwtSecret: string;

  @IsEnum(JwtAlgorithm)
  jwtAlgorithm: Algorithm;

  @Type(() => Number)
  @IsNumber()
  jwtExpire: number;

  @IsString()
  clientURI: string;
}

export const AppConfig = registerAs(App.name, (): InstanceType<typeof App> => {
  const config = {
    env: process.env.NODE_ENV,
    serviceName: process.env.SERVICE_NAME,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGORITHM,
    jwtExpire: process.env.JWT_EXPIRE,
    clientURI: process.env.CLIENT_URI,
  };

  return validateConfig(App, config);
});
