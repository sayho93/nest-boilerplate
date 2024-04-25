import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TRANSACTIONAL_KEY, TRANSACTIONAL_OPTION } from './database.constant';
import { Propagation, TransactionalOptions } from './database.interface';
import { TransactionalException } from '../../common/exceptions/transactional.exception';
import { AlsService } from '../als/als.service';
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

  private async runInNewHookContext(cb: () => Promise<unknown>) {
    try {
      const result = await cb();
      // setImmediate(() => {
      //   eventEmitter.emit('transaction.commit');
      //   eventEmitter.emit('transaction.release', undefined);
      // });

      return result;
    } catch (err) {
      // eventEmitter.emit('transaction.rollback');
      // eventEmitter.emit('transaction.release', undefined);
      throw err;
    }
  }

  private wrapMethod(originalMethod: any, options?: TransactionalOptions) {
    const { alsService, dataSource, runInNewHookContext } = this;

    return async function (...args: any[]) {
      const storedEntityManager = alsService.entityManager;
      const propagation = options?.propagation ?? Propagation.REQUIRED;
      const isolationLevel = options?.isolationLevel;

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
        return await runInNewHookContext(async () => {
          if (!alsService.entityManager) {
            if (isolationLevel) return dataSource.transaction(isolationLevel, transactionCallback);
            return dataSource.transaction(transactionCallback);
          }

          if (isolationLevel) return alsService.entityManager.transaction(isolationLevel, transactionCallback);
          return alsService.entityManager.transaction(transactionCallback);
        });
      };

      const runWithoutTransaction = async () => {
        return await runInNewHookContext(async () => {
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

        instance.instance[name] = this.wrapMethod(originalMethod, transactionalOptions);
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
