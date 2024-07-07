import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeCC } from '../request.entity';

@CustomRepository(RequestTypeCC)
export class RequestTypeCCRepository extends GenericTypeOrmRepository<RequestTypeCC> {}
