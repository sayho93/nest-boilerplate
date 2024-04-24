import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { UserCreatedProcessor } from './processors/user-created.processor';
import { QueueBoardModuleOptions } from './queue.interface';
import { Env } from '../configs/configs.interface';
import { ConfigsService } from '../configs/configs.service';

@Module({})
export class QueueModule {
  public static forRoot(imports: Required<ModuleMetadata>['imports']): DynamicModule {
    return {
      global: true,
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          inject: [ConfigsService],
          useFactory: (configsService: ConfigsService) => {
            const appConfig = configsService.App;
            const redisConfig = configsService.Redis;

            return {
              connection: {
                host: redisConfig.host,
                port: redisConfig.port,
                ...(appConfig.env === Env.Production && { password: redisConfig.password }),
                db: redisConfig.queueDb,
              },
              defaultJobOptions: {
                removeOnComplete: 1000,
                removeOnFail: 5000,
                attempts: 3,
              },
            };
          },
        }),
        ...imports,
      ],
      providers: [UserCreatedProcessor],
      exports: [BullModule],
    };
  }

  public static register(options: QueueBoardModuleOptions): DynamicModule {
    const bullModules = options.queues.map((name) => BullModule.registerQueue({ name: name.toString() }));

    const flowProducers = (options.flows || []).map((flow) =>
      BullModule.registerFlowProducer({
        name: flow.toString(),
      }),
    );

    return {
      module: QueueModule,
      imports: [...bullModules, ...flowProducers],
      exports: [...bullModules, ...flowProducers],
    };
  }
}
