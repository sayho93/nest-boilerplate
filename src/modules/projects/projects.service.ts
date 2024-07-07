import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './proejcts.repository';
import { LoggerService } from '../logger/logger.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsRepository: ProjectsRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async findOne(id: string) {
    return this.projectsRepository.findOneOrThrow({ id });
  }
}
