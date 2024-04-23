import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { USER_CREATED_EVENT } from '../queue/queue.constant';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule.register({ queues: [USER_CREATED_EVENT], flows: [USER_CREATED_EVENT] })],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
