import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Credit } from './entities/credit.entity';
import { BaseRepository } from '../database/base.repository';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CreditsRepository extends BaseRepository<Credit> {
  public constructor(
    dataSource: DataSource,
    protected readonly loggerService: LoggerService,
  ) {
    super(dataSource, Credit);
  }
}
