import { Module } from '@nestjs/common';
import { PROJECTS_QUEUE } from './projects.constant';
import { ProjectsController } from './projects.controller';
import { ProjectsQueueProcessor } from './projects.processor';
import { ProjectsService } from './projects.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule.register({ queues: [PROJECTS_QUEUE], flows: [PROJECTS_QUEUE] })],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsQueueProcessor],
  exports: [ProjectsService],
})
export class ProjectsModule {}
