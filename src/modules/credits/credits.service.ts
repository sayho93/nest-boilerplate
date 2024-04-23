import { Injectable } from '@nestjs/common';
import { CreditsRepository } from './credits.repository';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CreditsService {
  public constructor(
    private readonly repository: CreditsRepository,
    private readonly loggerService: LoggerService,
  ) {}

  create(createCreditDto: CreateCreditDto) {
    this.loggerService.debug(this.create.name, 'This action adds a new credit');
    return 'This action adds a new credit';
  }

  findAll() {
    return `This action returns all credits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} credit`;
  }

  update(id: number, updateCreditDto: UpdateCreditDto) {
    return `This action updates a #${id} credit`;
  }

  remove(id: number) {
    return `This action removes a #${id} credit`;
  }
}
