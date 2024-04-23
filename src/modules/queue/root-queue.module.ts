import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UserCreatedProcessor } from './processors/user-created.processor';
import { ConfigsService } from '../configs/configs.service';
import { CreditsModule } from '../credits/credits.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigsService],
      useFactory: (configsService: ConfigsService) => {
        const redisConfig = configsService.Redis;

        return {
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
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
    ProjectsModule,
    CreditsModule,
  ],
  providers: [UserCreatedProcessor],
})
export class RootQueueModule {}
