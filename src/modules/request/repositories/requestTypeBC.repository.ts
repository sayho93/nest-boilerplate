import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeBC } from '../request.entity';

@CustomRepository(RequestTypeBC)
export class RequestTypeBCRepository extends GenericTypeOrmRepository<RequestTypeBC> {}
