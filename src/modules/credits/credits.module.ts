import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CREDITS_QUEUE } from './credits.constant';
import { CreditsController } from './credits.controller';
import { CreditsQueueProcessor } from './credits.processor';
import { CreditsRepository } from './credits.repository';
import { CreditsService } from './credits.service';
import { Credit } from './entities/credit.entity';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credit]),
    QueueModule.register({ queues: [CREDITS_QUEUE], flows: [CREDITS_QUEUE] }),
  ],
  controllers: [CreditsController],
  providers: [CreditsService, CreditsRepository, CreditsQueueProcessor],
  exports: [CreditsService],
})
export class CreditsModule {}
