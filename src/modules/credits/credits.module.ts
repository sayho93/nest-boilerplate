import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditsController } from './credits.controller';
import { CreditsRepository } from './credits.repository';
import { CreditsService } from './credits.service';
import { Credit } from './entities/credit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credit]),
    // QueueModule.register({ queues: [USER_CREATED_EVENT], flows: [USER_CREATED_EVENT] }),
  ],
  controllers: [CreditsController],
  providers: [CreditsService, CreditsRepository],
  exports: [CreditsService],
})
export class CreditsModule {}
