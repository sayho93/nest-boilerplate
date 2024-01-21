import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TRANSACTIONAL_KEY } from '../../common/constants/database.constant';
import { isValueDefined } from '../../common/utils/validation';
import { AlsService } from '../als/als.service';
import { Env } from '../configs/configs.interface';
import { ConfigsService } from '../configs/configs.service';
import { UsersEntity } from '../users/entities/usersEntity';

@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService) => {
        const appConfig = configsService.App;
        const mariaDBConfig = configsService.MariaDB;

        return {
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
          entities: [UsersEntity],
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  public constructor(
    private readonly alsService: AlsService,
    private readonly discover: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  public onModuleInit() {
    this.transactionalWrap();
    this.wrapRepositories();
  }

  private wrapMethod(originalMethod: any, instance: any) {
    const { alsService, dataSource } = this;

    return async function (...args: any[]) {
      const storedQueryRunner = alsService.queryRunner;
      if (isValueDefined(storedQueryRunner)) return await originalMethod.apply(instance, args);

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      return await alsService.run({ queryRunner }, async () => {
        try {
          const result = await originalMethod.apply(instance, args);
          await queryRunner.commitTransaction(); // originalMethod 정상적으로 완료되면 커밋

          return result;
        } catch (error) {
          await queryRunner.rollbackTransaction(); // originalMethod 수행 중에 에러가 발생 시 롤백
          throw error;
        } finally {
          await queryRunner.release();
        }
      });
    };
  }

  private transactionalWrap() {
    const instances = this.discover
      .getProviders()
      .filter((e) => e.isDependencyTreeStatic())
      .filter(({ metatype, instance }) => instance && metatype);

    for (const instance of instances) {
      const names = this.metadataScanner.getAllMethodNames(Object.getPrototypeOf(instance.instance));

      for (const name of names) {
        const originalMethod = instance.instance[name];
        const isTransactional = this.reflector.get(TRANSACTIONAL_KEY, originalMethod);
        if (!isTransactional) continue;

        instance.instance[name] = this.wrapMethod(originalMethod, instance.instance);
      }
    }
  }

  private wrapRepositories() {
    const { alsService } = this;

    this.discover
      .getProviders()
      .filter((v) => v.isDependencyTreeStatic())
      .filter(({ metatype, instance }) => instance && metatype)
      .filter(({ instance }) => instance instanceof BaseRepository)
      .forEach(({ instance }) => {
        Object.defineProperty(instance, 'txManager', {
          configurable: false,
          get() {
            return alsService.queryRunner?.manager;
          },
        });
      });
  }
}
