import { BullModule, OnQueueEvent, QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';
import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { QueueEventListenerTokenPrefix } from './queue.constant';
import { QueueBoardModuleOptions } from './queue.interface';
import { Env } from '../configs/configs.interface';
import { ConfigsService } from '../configs/configs.service';

@Module({})
export class QueueModule {
  public static forRoot(imports: Required<ModuleMetadata>['imports']): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          inject: [ConfigsService],
          useFactory: async (configsService: ConfigsService) => {
            const appConfig = configsService.App;
            const redisConfig = configsService.Redis;

            return {
              connection: {
                host: redisConfig.host,
                port: redisConfig.port,
                ...(appConfig.env === Env.Production && { password: redisConfig.password }),
                db: redisConfig.queueDb,
                enableOfflineQueue: false,
              },
              defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: 5000,
                attempts: 3,
              },
            };
          },
        }),
        ...imports,
      ],
      exports: [BullModule],
    };
  }

  public static register(options: QueueBoardModuleOptions): DynamicModule {
    const bullModules = options.queues.map((name) => BullModule.registerQueueAsync({ name }));

    const flowProducers = (options.flows || []).map((flow) =>
      BullModule.registerFlowProducerAsync({
        name: flow,
      }),
    );

    const queueEventListeners = options.queues.reduce<Required<Pick<ModuleMetadata, 'providers' | 'exports'>>>(
      (acc, name) => {
        const token = `${QueueEventListenerTokenPrefix}-${name}`;

        acc.providers.push({
          provide: token,
          useFactory: () => {
            @QueueEventsListener(name)
            class EventsListener extends QueueEventsHost {
              @OnQueueEvent('completed')
              onCompleted() {}
            }

            return new EventsListener();
          },
        });
        acc.exports.push(token);

        return acc;
      },
      { providers: [], exports: [] },
    );

    return {
      module: QueueModule,
      imports: [...bullModules, ...flowProducers],
      providers: [...queueEventListeners.providers],
      exports: [...bullModules, ...flowProducers, ...queueEventListeners.exports],
    };
  }
}
