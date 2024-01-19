import { registerAs } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { validateConfig } from './validation';
import { MariaDB as IMariaDB } from '../configs.interface';

export class MariaDB implements IMariaDB {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsString()
  database: string;
}

export const MariaDBConfig = registerAs(MariaDB.name, () => {
  const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

  return validateConfig(MariaDB, config);
});
