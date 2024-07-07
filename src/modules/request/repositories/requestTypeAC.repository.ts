import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeAC } from '../request.entity';

@CustomRepository(RequestTypeAC)
export class RequestTypeACRepository extends GenericTypeOrmRepository<RequestTypeAC> {}
