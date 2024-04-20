import { BullModule } from '@nestjs/bullmq';
import { ConfigurableModuleBuilder, DynamicModule, Module } from '@nestjs/common';
import { QueueBoardModuleOptions } from './queue.interface';

const { ConfigurableModuleClass, OPTIONS_TYPE } = new ConfigurableModuleBuilder<QueueBoardModuleOptions>().build();

@Module({})
export class QueueModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const bullModules = options.queues.map((name) => BullModule.registerQueue({ name: name.toString() }));

    const flowProducers = (options.flows || []).map((flow) =>
      BullModule.registerFlowProducer({
        name: flow.toString(),
      }),
    );

    return {
      ...super.register(options),
      imports: [...bullModules, ...flowProducers],
      exports: [...bullModules, ...flowProducers],
    };
  }
}
