import { registerAs } from '@nestjs/config';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { validateConfig } from './validation';
import { App as IApp, Env } from '../configs.interface';

export class App implements IApp {
  @IsEnum(Env)
  env: Env;

  @IsNumber()
  port: number;

  @IsString()
  serviceName: string;
}

export const AppConfig = registerAs(App.name, () => {
  const config = {
    env: process.env.NODE_ENV,
    serviceName: process.env.SERVICE_NAME,
    port: process.env.PORT,
  };

  return validateConfig(App, config);
});
