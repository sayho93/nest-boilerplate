import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeBA } from '../request.entity';

@CustomRepository(RequestTypeBA)
export class RequestTypeBARepository extends GenericTypeOrmRepository<RequestTypeBA> {}
