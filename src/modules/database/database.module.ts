import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Auth } from '../auth/entities/auth.entity';
import { Env } from '../configs/configs.interface';
import { ConfigsService } from '../configs/configs.service';
import { Credit } from '../credits/entities/credit.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService) => {
        const appConfig = configsService.App;
        const mariaDBConfig = configsService.MariaDB;

        const connectionInfo: TypeOrmModuleOptions = {
          type: 'mariadb',
          host: mariaDBConfig.host,
          port: mariaDBConfig.port,
          username: mariaDBConfig.user,
          password: mariaDBConfig.password,
          database: mariaDBConfig.database,
          autoLoadEntities: false,
          synchronize: false,
          dropSchema: false,
          logging: appConfig.env === Env.Development,
          entities: [User, Auth, Credit],
        };

        return connectionInfo;
      },
    }),
  ],
})
export class DatabaseModule {}
