import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeC } from '../request.entity';

@CustomRepository(RequestTypeC)
export class RequestTypeCRepository extends GenericTypeOrmRepository<RequestTypeC> {}
