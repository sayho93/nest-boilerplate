import { Module } from '@nestjs/common';
import { UserCreatedProcessor } from './processors/user-created.processor';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { QueueModule } from '../queue/queue.module';
import { USER_CREATED } from '../users/users.const';

@Module({
  imports: [QueueModule.register({ queues: [USER_CREATED], flows: [USER_CREATED] })],
  controllers: [ProjectsController],
  providers: [ProjectsService, UserCreatedProcessor],
})
export class ProjectsModule {}
