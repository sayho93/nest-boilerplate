import { GenericTypeOrmRepository } from '../../database/generic-typeorm.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { RequestTypeBB } from '../request.entity';

@CustomRepository(RequestTypeBB)
export class RequestTypeBBRepository extends GenericTypeOrmRepository<RequestTypeBB> {}
