import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { validateConfig } from './validation';

export class MariaDB {
  @IsString()
  host: string;

  @Type(() => Number)
  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsString()
  database: string;
}

export const MariaDBConfig = registerAs(MariaDB.name, (): InstanceType<typeof MariaDB> => {
  const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

  return validateConfig(MariaDB, config);
});
