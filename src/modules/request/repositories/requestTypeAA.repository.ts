import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeAA } from '../request.entity';

@CustomRepository(RequestTypeAA)
export class RequestTypeAARepository extends GenericTypeOrmRepository<RequestTypeAA> {}
