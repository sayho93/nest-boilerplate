import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeA } from '../request.entity';

@CustomRepository(RequestTypeA)
export class RequestTypeARepository extends GenericTypeOrmRepository<RequestTypeA> {}
