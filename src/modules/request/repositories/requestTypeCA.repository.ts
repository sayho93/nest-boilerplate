import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeCA } from '../request.entity';

@CustomRepository(RequestTypeCA)
export class RequestTypeCARepository extends GenericTypeOrmRepository<RequestTypeCA> {}
