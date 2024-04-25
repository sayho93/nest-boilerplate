import { Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import { CREDITS_QUEUE, CreditsQueueOps } from './credits.constant';
import { CreditsService } from './credits.service';
import { Credit } from './entities/credit.entity';
import { LoggerService } from '../logger/logger.service';
import { WorkerHostProcessor } from '../queue/worker-host.process';
import { User } from '../users/entities/user.entity';

@Processor(CREDITS_QUEUE)
export class CreditsQueueProcessor extends WorkerHostProcessor {
  constructor(
    private readonly creditsService: CreditsService,
    protected readonly loggerService: LoggerService,
  ) {
    super();
  }

  public async process(job: Job<User, Credit>) {
    const user = job.data;

    switch (job.name) {
      case CreditsQueueOps.MAKE_VARIANCE:
        return this.creditsService.create({});
    }

    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
