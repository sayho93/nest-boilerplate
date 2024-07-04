import { ForbiddenException } from '@nestjs/common';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { IRequest, Request } from '../request.entity';

@CustomRepository(Request)
export class RequestRepository extends GenericTypeOrmRepository<IRequest> {
  // @TransformPlainToInstance(RequestTypeA)
  // public async findManyTypeA(): Promise<RequestTypeA[]> {
  //   const result = await this.find({ where: { type: RequestType.TypeA } });
  //
  //   return result as RequestTypeA[];
  // }

  public override async save(entity: Request[], options: SaveOptions & { reload: false }): Promise<Request[]>;
  public override async save(
    entity: Request | Request[],
    options: SaveOptions & { reload: false },
  ): Promise<Request | Request[]> {
    throw new ForbiddenException('not authorized to call this method');
  }
}
