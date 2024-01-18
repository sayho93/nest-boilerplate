import { MariaDB } from '../configs.interface';
import { registerAs } from '@nestjs/config';

export const MariaDBConfig = registerAs(
  'MariaDB',
  (): MariaDB => ({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  }),
);
