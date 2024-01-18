import { Env } from '../configs.interface';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class EnvironmentVariables {
  /**
   * App
   */
  @IsEnum(Env)
  NODE_ENV: Env;

  @IsString()
  SERVICE_NAME: string;

  @IsNumber()
  PORT: number;

  /**
   * REDIS
   */
  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  REDIS_PASSWORD: string;

  /**
   * MariaDB
   */
  @IsString()
  DB_HOST: string;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsNumber()
  DB_PORT: number;

  /**
   * Mail
   */
  @IsString()
  MAIL_SERVICE: string;

  @IsString()
  MAIL_HOST: string;

  @IsNumber()
  MAIL_PORT: number;

  @IsString()
  MAIL_USER: string;

  @IsString()
  MAIL_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
