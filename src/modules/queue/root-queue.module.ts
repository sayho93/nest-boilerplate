import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigsService } from '../configs/configs.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService) => {
        const redisConfig = configsService.Redis;

        console.log('redisConfig', redisConfig);
        return {
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
          },
          defaultJobOptions: {
            removeOnComplete: 1000,
            removeOnFail: 5000,
            attempts: 3,
          },
        };
      },
    }),
  ],
})
export class RootQueueModule {}
