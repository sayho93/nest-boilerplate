import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

console.log('env: ', process.env.NODE_ENV);
config({ path: `./.env/.env.${process.env.NODE_ENV}` });

const options: DataSourceOptions & SeederOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/src/modules/**/*.entity.ts'],
  synchronize: false,
  migrations: [__dirname + '/migrations/*.ts'],
  migrationsRun: false,
  migrationsTableName: 'migrations',

  seeds: ['migrations/seeds/**/*.ts'],
  seedTracking: false,
  factories: ['migrations/factories/**/*.ts'],
};

console.log(options);

export const dataSource = new DataSource(options);
