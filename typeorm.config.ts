import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: [__dirname + '/**/*.entity.ts'],
  synchronize: false,
  migrations: [__dirname + '/migrations/*.ts'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
});
