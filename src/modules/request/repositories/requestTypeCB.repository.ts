import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeCB } from '../request.entity';

@CustomRepository(RequestTypeCB)
export class RequestTypeCBRepository extends GenericTypeOrmRepository<RequestTypeCB> {}
