import { QueueEventsHost } from '@nestjs/bullmq';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { GENERAL_CACHE } from '../cache/cache.constant';
import { Cache } from '../cache/cache.decorator';
import { CacheService } from '../cache/cache.service';
import { CreditsQueueOps } from '../credits/credits.constant';
import { Credit } from '../credits/entities/credit.entity';
import { LoggerService } from '../logger/logger.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectsQueueOps } from '../projects/projects.constant';
import { InjectCreditsQueue, InjectProjectQueueEventsListener, InjectProjectsQueue } from '../queue/queue.decorator';
import { Transactional } from '../transaction/transaciton.decorator';
import { Propagation } from '../transaction/transaction.interface';

@Injectable()
export class UsersService {
  public constructor(
    private readonly repository: UsersRepository,
    @InjectProjectsQueue() private readonly projectsQueue: Queue<User, Project>,
    @InjectCreditsQueue() private readonly creditQueue: Queue<User, Credit>,
    @InjectProjectQueueEventsListener() private readonly projectsQueueEventListener: QueueEventsHost,
    @Inject(GENERAL_CACHE) private readonly cacheService: CacheService,
    private readonly loggerService: LoggerService,
  ) {}

  @Transactional()
  public async create(createUserDto: CreateUserDto) {
    const user = await this.repository.create(createUserDto);

    const [projectJob] = await Promise.all([
      this.projectsQueue.add(ProjectsQueueOps.CREATE_DEFAULT, user),
      this.creditQueue.add(CreditsQueueOps.MAKE_VARIANCE, user),
    ]);

    const res = await projectJob.waitUntilFinished(this.projectsQueueEventListener.queueEvents);
    this.loggerService.debug(this.create.name, res);

    return user;
  }

  @Cache({})
  @Transactional()
  public async findMany(findUserDto: FindUsersDto) {
    const result = await this.repository.findMany(findUserDto);

    // try {
    //   const test = await this.findOneById('856be21d-81b7-476c-aff9-b32a02aa8d58');
    //   console.log(test);
    // } catch (err) {}
    //
    // const test2 = await this.findOneById2('856be21d-81b7-476c-aff9-b32a02aa8d58');
    // console.log(test2);

    return result;
  }

  @Cache({})
  @Transactional({ propagation: Propagation.NESTED })
  public async findOneById(id: string) {
    const user = await this.repository.findOneById(id);
    if (!user) throw new NotFoundException('user not found');

    if (Math.random() < 1) {
      // throw new Error('::');
    }

    return user;
  }

  @Cache({})
  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  public async findOneById2(id: string) {
    const user = await this.repository.findOneById(id);
    if (!user) throw new NotFoundException('user not found');

    if (Math.random() < 1) {
      throw new Error('::');
    }

    return user;
  }

  @Transactional()
  public async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repository.updateOne(id, updateUserDto);
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  @Transactional()
  public async remove(id: string) {
    const isDeleted = await this.repository.remove(id);
    if (!isDeleted) throw new NotFoundException('user not found');
  }
}
