import { Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import { LoggerService } from '../../logger/logger.service';
import { WorkerHostProcessor } from '../../queue/worker-host.process';
import { User } from '../../users/user.entity';
import { USER_CREATED, UserCreatedOps } from '../../users/users.const';
import { ProjectsService } from '../projects.service';

@Processor(USER_CREATED.toString())
export class UserCreatedProcessor extends WorkerHostProcessor {
  constructor(
    private readonly projectsService: ProjectsService,
    protected readonly loggerService: LoggerService,
  ) {
    super();
  }

  public async process(job: Job<User, User | string, string>) {
    const user = job.data;
    switch (job.name) {
      case UserCreatedOps.CREATE_DEFAULT_PROJECT:
        return this.projectsService.create({});
    }

    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
