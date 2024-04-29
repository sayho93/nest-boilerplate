import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { CREDITS_QUEUE } from '../credits/credits.constant';
import { PROJECTS_QUEUE } from '../projects/projects.constant';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), QueueModule.register({ queues: [PROJECTS_QUEUE, CREDITS_QUEUE] })],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
