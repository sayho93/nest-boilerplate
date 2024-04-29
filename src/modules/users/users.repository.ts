import { Injectable } from '@nestjs/common';
import { DataSource, Like } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';
import { BaseRepository } from '../database/base.repository';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  public constructor(
    dataSource: DataSource,
    protected readonly loggerService: LoggerService,
  ) {
    super(dataSource, User);
  }

  public async findMany(findUserDto: FindUsersDto) {
    const { page, limit, skip, take, searchText } = findUserDto;
    const findManyOptions: FindManyOptions<User> = {
      skip,
      take,
      relations: { auths: true },
      // relationLoadStrategy: 'join',
    };

    if (searchText) {
      const likeQuery = Like(`%${searchText}%`);
      findManyOptions.where = [{ alias: likeQuery }];
    }

    return super.findAllPaginated(page, limit, findManyOptions);
  }
}
