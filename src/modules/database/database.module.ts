import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Propagation, TransactionalOptions } from './database.interface';
import { TRANSACTIONAL_KEY, TRANSACTIONAL_OPTION } from '../../common/constants/database.constant';
import { TransactionalException } from '../../common/exceptions/transactional.exception';
import { AlsService } from '../als/als.service';
import { Env } from '../configs/configs.interface';
import { ConfigsService } from '../configs/configs.service';
import { LoggerService } from '../logger/logger.service';
import { UsersEntity } from '../users/entities/users.entity';

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
      // async dataSourceFactory(options?: DataSourceOptions) {
      //   if (!options) {
      //     throw new Error('Invalid options');
      //   }
      //   //
      //   // const dataSource = new DataSource(options);
      //   //
      //   // if (isDataSource(dataSource)) {
      //   //   input = { name: 'default', dataSource: input, patch: true };
      //   // }
      //   //
      //   // const { name = 'default', dataSource, patch = true } = input;
      //   // if (dataSources.has(name)) {
      //   //   throw new Error(`DataSource with name "${name}" has already added.`);
      //   // }
      //   //
      //   // if (patch) {
      //   //   patchDataSource(dataSource);
      //   // }
      //   //
      //   // dataSources.set(name, dataSource);
      //   // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   // // @ts-ignore
      //   // dataSource[TYPEORM_DATA_SOURCE_NAME] = name;
      //   //
      //   // return input.dataSource;
      //   //
      //   // return;
      // },
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
    private eventEmitter: EventEmitter2,
    private readonly loggerService: LoggerService,
  ) {}

  public onModuleInit() {
    this.transactionalWrap();
    this.wrapRepositories();
  }

  private async runInNewHookContext(alsService: AlsService, cb: () => Promise<unknown>) {
    try {
      console.log('................................................................');
      const result = await cb();

      // alsService.entityManager?.queryRunner?.commitTransaction();
      // alsService.entityManager?.release();
      // setImmediate(() => {
      //   eventEmitter.emit('test.commit');
      //   eventEmitter.emit('test.release', undefined);
      // });

      return result;
    } catch (err) {
      // alsService.entityManager?.queryRunner?.rollbackTransaction();
      // alsService.entityManager?.release();
      // eventEmitter.emit('test.rollback');
      // eventEmitter.emit('test.release', undefined);
      throw err;
    }

    // return await alsService.run({ ...alsService.store, entityManager: alsService.entityManager }, async () => {});
  }

  private wrapMethod(originalMethod: any, instance: any, options?: TransactionalOptions) {
    const { alsService, dataSource, runInNewHookContext, eventEmitter, loggerService } = this;

    return async function (...args: any[]) {
      const storedEntityManager = alsService.entityManager;
      const propagation = options?.propagation ?? Propagation.REQUIRED;

      const runOriginal = async () => originalMethod.apply(this, args);

      const transactionCallback = async (entityManager: EntityManager) => {
        alsService.entityManager = entityManager;
        try {
          return await runOriginal();
        } finally {
          // alsService.entityManager = undefined;
        }
      };

      const runWithNewTransaction = async () => {
        loggerService.info(runWithNewTransaction.name, 'run with new transaction ----------');
        return await runInNewHookContext(alsService, async () => {
          if (!alsService.entityManager) {
            console.log('::::No entity Manager');
            return dataSource.transaction(transactionCallback);
          }

          console.log('::::entity Manager exists');
          return alsService.entityManager.transaction(transactionCallback);
        });
      };

      const runWithoutTransaction = async () => {
        return await runInNewHookContext(alsService, async () => {
          loggerService.info(runWithNewTransaction.name, 'run without ----------');
          const currentTransaction = alsService.entityManager;
          alsService.entityManager = undefined;
          const originalMethodResult = await runOriginal();
          alsService.entityManager = currentTransaction;

          return originalMethodResult;
        });
      };

      switch (propagation) {
        case Propagation.MANDATORY:
          if (!storedEntityManager) {
            throw new TransactionalException('No existing transaction found');
          }

          return await runOriginal();

        case Propagation.NESTED:
          return await runWithNewTransaction();

        case Propagation.NEVER:
          if (storedEntityManager) {
            throw new TransactionalException('Found existing transaction');
          }
          return await runWithoutTransaction();

        case Propagation.NOT_SUPPORTED:
          if (storedEntityManager) {
            return await runWithoutTransaction();
          }

          return await runOriginal();

        case Propagation.REQUIRED:
          if (storedEntityManager) return await runOriginal();
          return await runWithNewTransaction();

        case Propagation.REQUIRES_NEW:
          return runWithNewTransaction();

        case Propagation.SUPPORTS:
        //TODO

        default:
          throw new Error('propagation option is unreachable');
      }
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
        const isTransactional = this.reflector.get<boolean | undefined>(TRANSACTIONAL_KEY, originalMethod);
        if (!isTransactional) continue;

        const transactionalOptions = this.reflector.get<TransactionalOptions | undefined>(
          TRANSACTIONAL_OPTION,
          originalMethod,
        );

        instance.instance[name] = this.wrapMethod(originalMethod, instance.instance, transactionalOptions);
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
            return alsService.entityManager;
          },
        });
      });
  }
}
