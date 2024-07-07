import { Module } from '@nestjs/common';
import { ProjectsRepository } from './proejcts.repository';
import { PROJECTS_QUEUE } from './projects.constant';
import { ProjectsController } from './projects.controller';
import { ProjectsQueueProcessor } from './projects.processor';
import { ProjectsService } from './projects.service';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { QueueModule } from '../queue/queue.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ProjectsRepository]),
    QueueModule.register({ queues: [PROJECTS_QUEUE], flows: [PROJECTS_QUEUE] }),
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsQueueProcessor],
  exports: [ProjectsService],
})
export class ProjectsModule {}
