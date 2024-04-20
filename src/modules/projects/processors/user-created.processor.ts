import { Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import { LoggerService } from '../../logger/logger.service';
import { USER_CREATED_EVENT, UserCreatedEventOps } from '../../queue/queue.const';
import { WorkerHostProcessor } from '../../queue/worker-host.process';
import { User } from '../../users/user.entity';
import { ProjectsService } from '../projects.service';

@Processor(USER_CREATED_EVENT)
export class UserCreatedProcessor extends WorkerHostProcessor {
  constructor(
    private readonly projectsService: ProjectsService,
    protected readonly loggerService: LoggerService,
  ) {
    super();
  }

  public async process(job: Job<User, User | string, string>): Promise<string> {
    const user = job.data;
    switch (job.name) {
      case UserCreatedEventOps.CREATE_DEFAULT_PROJECT:
        return this.projectsService.create({});
    }

    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
