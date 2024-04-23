import { Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import { CreditsService } from '../../credits/credits.service';
import { LoggerService } from '../../logger/logger.service';
import { ProjectsService } from '../../projects/projects.service';
import { User } from '../../users/user.entity';
import { USER_CREATED_EVENT, UserCreatedEventOps } from '../queue.constant';
import { WorkerHostProcessor } from '../worker-host.process';

@Processor(USER_CREATED_EVENT)
export class UserCreatedProcessor extends WorkerHostProcessor {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly creditsService: CreditsService,
    protected readonly loggerService: LoggerService,
  ) {
    super();
  }

  public async process(job: Job<User, User | string, string>): Promise<string> {
    const user = job.data;

    switch (job.name) {
      case UserCreatedEventOps.CREATE_DEFAULT_PROJECT:
        return this.projectsService.create({});
      case UserCreatedEventOps.GRANT_CREDIT:
        return this.creditsService.create({});
    }

    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
