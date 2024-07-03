import { Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { sleep } from '@nestjs/terminus/dist/utils';
import { Job } from 'bullmq';
import { CREDITS_QUEUE, CreditsQueueOps } from './credits.constant';
import { CreditsService } from './credits.service';
import { Credit } from './entities/credit.entity';
import { LoggerService } from '../logger/logger.service';
import { WorkerHostProcessor } from '../queue/worker-host.process';
import { User } from '../users/entities/user.entity';

@Processor(CREDITS_QUEUE, { concurrency: Number.MAX_SAFE_INTEGER })
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

      case CreditsQueueOps.SOME_LONG_TASK:
        if (user.id !== '7a0b8bb4-d3ef-4691-91d0-6ecb5f11ae0d') return { id: job.id };

        await sleep(5000);
        return { id: job.id };
    }

    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
