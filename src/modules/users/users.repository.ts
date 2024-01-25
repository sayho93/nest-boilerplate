import { Injectable } from '@nestjs/common';
import { DataSource, Like } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindUsersDto } from './dto/find-users.dto';
import { UsersEntity } from './entities/users.entity';
import { AlsService } from '../als/als.service';
import { BaseRepository } from '../database/base.repository';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersRepository extends BaseRepository<UsersEntity> {
  public constructor(
    dataSource: DataSource,
    protected readonly alsService: AlsService,
    protected readonly loggerService: LoggerService,
  ) {
    super(dataSource, UsersEntity);
  }

  public async findMany(findUserDto: FindUsersDto) {
    const { page, limit, skip, take, searchText } = findUserDto;
    const findManyOptions: FindManyOptions<UsersEntity> = { skip, take };

    if (searchText) {
      const likeQuery = Like(`%${searchText}%`);
      findManyOptions.where = [{ name: likeQuery }, { alias: likeQuery }, { email: likeQuery }];
    }

    return super.findAllPaginated(page, limit, findManyOptions);
  }
}
