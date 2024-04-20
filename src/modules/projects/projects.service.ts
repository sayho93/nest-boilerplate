import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly loggerService: LoggerService) {}

  public async create(createProjectDto: CreateProjectDto) {
    this.loggerService.debug(this.create.name, 'This action adds a new project');
    return 'This action adds a new project';
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
