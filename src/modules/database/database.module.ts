import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Auth } from '../auth/entities/auth.entity';
import { ConfigsService } from '../configs/configs.service';
import { Credit } from '../credits/entities/credit.entity';
import { Project } from '../projects/entities/project.entity';
import {
  Request,
  RequestTypeAA,
  RequestTypeAB,
  RequestTypeAC,
  RequestTypeBA,
  RequestTypeBB,
  RequestTypeBC,
  RequestTypeCA,
  RequestTypeCB,
  RequestTypeCC,
} from '../request/request.entity';
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
          type: 'mysql',
          host: mariaDBConfig.host,
          port: mariaDBConfig.port,
          username: mariaDBConfig.user,
          password: mariaDBConfig.password,
          database: mariaDBConfig.database,
          autoLoadEntities: false,
          synchronize: false,
          dropSchema: false,
          logging: true,
          entities: [
            User,
            Auth,
            Credit,
            Project,
            Request,
            RequestTypeAA,
            RequestTypeAB,
            RequestTypeAC,
            RequestTypeBA,
            RequestTypeBB,
            RequestTypeBC,
            RequestTypeCA,
            RequestTypeCB,
            RequestTypeCC,
          ],
        };

        return connectionInfo;
      },
    }),
  ],
})
export class DatabaseModule {}
