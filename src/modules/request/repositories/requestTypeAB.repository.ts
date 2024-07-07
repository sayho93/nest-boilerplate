import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeAB } from '../request.entity';

@CustomRepository(RequestTypeAB)
export class RequestTypeABRepository extends GenericTypeOrmRepository<RequestTypeAB> {}
