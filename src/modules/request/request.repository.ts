import { TransformPlainToInstance } from 'class-transformer';
import { Request, RequestTypeA } from './entities/request.entity';
import { RequestType } from './request.interface';
import { GenericTypeOrmRepository } from '../database/generic-typeorm.repository';
import { CustomRepository } from '../database/typeorm-ex.decorator';

@CustomRepository(Request)
export class RequestRepositoryRepository extends GenericTypeOrmRepository<Request> {
  @TransformPlainToInstance(RequestTypeA)
  public async findManyTypeA(): Promise<RequestTypeA[]> {
    const result = await this.find({ where: { type: RequestType.TypeA } });
    return result as RequestTypeA[];
  }
}
