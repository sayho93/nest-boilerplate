import { Processor } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import { Project } from './entities/project.entity';
import { PROJECTS_QUEUE, ProjectsQueueOps } from './projects.constant';
import { ProjectsService } from './projects.service';
import { LoggerService } from '../logger/logger.service';
import { WorkerHostProcessor } from '../queue/worker-host.process';
import { User } from '../users/entities/user.entity';

@Processor(PROJECTS_QUEUE)
export class ProjectsQueueProcessor extends WorkerHostProcessor {
  public constructor(
    private readonly projectsService: ProjectsService,
    protected readonly loggerService: LoggerService,
  ) {
    super();
  }

  public async process(job: Job<User, Project>) {
    const user = job.data;

    switch (job.name) {
      case ProjectsQueueOps.CREATE_DEFAULT:
        return this.projectsService.create(user);
    }

    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }
}
