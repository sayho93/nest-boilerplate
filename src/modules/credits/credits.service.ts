import { QueueEventsHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CreditsQueueOps } from './credits.constant';
import { CreditsRepository } from './credits.repository';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { LoggerService } from '../logger/logger.service';
import { InjectCreditsQueue, InjectCreditsQueueEventsListener } from '../queue/queue.decorator';
import { Transactional } from '../transaction/transaciton.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CreditsService {
  public constructor(
    private readonly repository: CreditsRepository,
    @InjectCreditsQueue() private readonly creditsQueue: Queue<User, string>,
    @InjectCreditsQueueEventsListener() private readonly creditsQueueEventListener: QueueEventsHost,
    private readonly usersService: UsersService,
    private readonly loggerService: LoggerService,
  ) {}

  public async create(createCreditDto: CreateCreditDto) {
    this.loggerService.debug(this.create.name, 'This action adds a new credit');
    return 'This action adds a new credit';
  }

  public async findAll() {
    return `This action returns all credits`;
  }

  @Transactional()
  public async findOne(id: string) {
    const job = await this.creditsQueue.getJob(id);
    console.log(job);

    if (job && !(await job.isFailed())) {
      this.loggerService.debug(this.findOne.name, 'existing job found!');
      return job.waitUntilFinished(this.creditsQueueEventListener.queueEvents);
    }

    const user = await this.usersService.findOneById('04df85b1-95c7-4b68-b500-070c6a1f74fb');
    user.id = id;

    const client = await this.creditsQueue.client;
    this.loggerService.warn(this.findOne.name, client.status);

    const newJob = await this.creditsQueue.add(CreditsQueueOps.SOME_LONG_TASK, user, { jobId: id });

    return newJob.waitUntilFinished(this.creditsQueueEventListener.queueEvents);
  }

  public async update(id: number, updateCreditDto: UpdateCreditDto) {
    return `This action updates a #${id} credit`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} credit`;
  }
}
