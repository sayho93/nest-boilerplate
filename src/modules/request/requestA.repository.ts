import { Request, RequestTypeA } from './entities/request.entity';
import { GenericTypeOrmRepository } from '../database/generic-typeorm.repository';
import { CustomRepository } from '../database/typeorm-ex.decorator';

@CustomRepository(Request)
export class RequestTypeARepositoryRepository extends GenericTypeOrmRepository<RequestTypeA> {}
