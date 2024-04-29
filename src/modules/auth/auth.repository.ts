import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { BaseRepository } from '../database/base.repository';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthRepository extends BaseRepository<Auth> {
  public constructor(
    dataSource: DataSource,
    protected readonly loggerService: LoggerService,
  ) {
    super(dataSource, Auth);
  }
}
