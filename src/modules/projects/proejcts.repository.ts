import { Project } from './entities/project.entity';
import { GenericTypeOrmRepository } from '../database/generic-typeorm.repository';
import { CustomRepository } from '../database/typeorm-ex.decorator';

@CustomRepository(Project)
export class ProjectsRepository extends GenericTypeOrmRepository<Project> {}
