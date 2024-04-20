import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCreatedOps } from './users.const';
import { UsersRepository } from './users.repository';
import { GENERAL_CACHE } from '../cache/cache.constant';
import { CacheService } from '../cache/cache.service';
import { Transactional } from '../database/transactional.decorator';
import { LoggerService } from '../logger/logger.service';
import { InjectUserCreatedQueue } from '../queue/queue.decorator';

@Injectable()
export class UsersService {
  public constructor(
    private readonly repository: UsersRepository,
    @InjectUserCreatedQueue() private readonly userCreatedQueue: Queue,
    @Inject(GENERAL_CACHE) private readonly cacheService: CacheService,
    private readonly loggerService: LoggerService,
  ) {}

  @Transactional()
  public async create(createUserDto: CreateUserDto) {
    const user = await this.repository.create(createUserDto);
    await this.userCreatedQueue.add(UserCreatedOps.CREATE_DEFAULT_PROJECT, user);
    return user;
  }

  @Transactional()
  public async findMany(findUserDto: FindUsersDto) {
    return this.repository.findMany(findUserDto);
  }

  @Transactional()
  public async findOneById(id: string) {
    const user = await this.repository.findOneById(id);
    if (!user) throw new NotFoundException('user not found');

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
