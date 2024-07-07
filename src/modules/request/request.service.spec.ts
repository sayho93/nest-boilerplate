import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { AppModule } from '../app.module';
import { LoggerService } from '../logger/logger.service';
import { ProjectsRepository } from '../projects/proejcts.repository';
import { UsersService } from '../users/users.service';

describe('RequestService', () => {
  let service: RequestService;
  let projectsRepository: ProjectsRepository;
  let usersService: UsersService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<RequestService>(RequestService);
    usersService = module.get<UsersService>(UsersService);
    projectsRepository = await module.resolve<ProjectsRepository>(ProjectsRepository);
    loggerService = await module.resolve<LoggerService>(LoggerService);
  });

  // it('creates project', async () => {
  //   const project = new Project();
  //
  //   project.name = 'genesisProject';
  //   project.description = 'genesis project info';
  //
  //   const user = await usersService.findOneById('0072727e-975b-45cb-b269-3519571a61cd');
  //
  //   project.createdBy = user;
  //   project.updatedBy = user;
  //
  //   await projectsRepository.save(project);
  // });

  it('creates', async () => {
    const typeAA = await service.createTypeAA('0072727e-975b-45cb-b269-3519571a61cd');
    // const typAB = await service.createTypeAB();
    // const typeAC = await service.createTypeAC();
    //
    // const typeBA = await service.createTypeBA();
    // const typeBB = await service.createTypeBB();
    // const typeBC = await service.createTypeBC();
    //
    // const typeCA = await service.createTypeCA();
    // const typeCB = await service.createTypeCB();
    // const typeCC = await service.createTypeCC();
  });
  //
  // it('finds', async () => {
  //   const result = await service.findAll();
  // });
});
