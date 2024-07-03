import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, FindOptionsRelations, Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

@Injectable()
export class GenericTypeOrmRepository<T extends ObjectLiteral> extends Repository<T> {
  async findOneWithJoinOrThrow(filters: Partial<T>, findOptionsRelations: FindOptionsRelations<T>): Promise<T> {
    const findOption: FindOneOptions = { where: filters, relations: findOptionsRelations };
    const res = await this.findOne(findOption);

    if (!res) {
      const msgList = [];
      for (const [key, value] of Object.entries(filters)) {
        msgList.push(`${key}: ${value}`);
      }
      throw new BadRequestException(`don't exist ${msgList.join(', ')}`);
    }

    return res;
  }

  async findOneOrThrow(filters: Partial<T>): Promise<T> {
    const findOption: FindOneOptions = { where: filters };
    const res = await this.findOne(findOption);

    if (!res) {
      const msgList = [];
      for (const [key, value] of Object.entries(filters)) {
        msgList.push(`${key}: ${value}`);
      }
      throw new NotFoundException(`don't exist ${msgList.join(', ')}`);
    }

    return res;
  }
}
