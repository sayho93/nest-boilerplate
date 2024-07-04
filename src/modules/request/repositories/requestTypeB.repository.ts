import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeB } from '../request.entity';

@CustomRepository(RequestTypeB)
export class RequestTypeBRepository extends GenericTypeOrmRepository<RequestTypeB> {}
