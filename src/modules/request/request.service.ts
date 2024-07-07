import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { RequestRepository } from './repositories/request.repository';
import { RequestTypeAARepository } from './repositories/requestTypeAA.repository';
import { RequestTypeABRepository } from './repositories/requestTypeAB.repository';
import { RequestTypeACRepository } from './repositories/requestTypeAC.repository';
import { RequestTypeBARepository } from './repositories/requestTypeBA.repository';
import { RequestTypeBBRepository } from './repositories/requestTypeBB.repository';
import { RequestTypeBCRepository } from './repositories/requestTypeBC.repository';
import { RequestTypeCARepository } from './repositories/requestTypeCA.repository';
import { RequestTypeCBRepository } from './repositories/requestTypeCB.repository';
import { RequestTypeCCRepository } from './repositories/requestTypeCC.repository';
import {
  Request,
  RequestTypeAA,
  RequestTypeAB,
  RequestTypeAC,
  RequestTypeBA,
  RequestTypeBB,
  RequestTypeBC,
  RequestTypeCA,
  RequestTypeCB,
  RequestTypeCC,
} from './request.entity';
import { LoggerService } from '../logger/logger.service';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequestService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private readonly requestRepository: RequestRepository,
    private readonly requestTypeAARepository: RequestTypeAARepository,
    private readonly requestTypeABRepository: RequestTypeABRepository,
    private readonly requestTypeACRepository: RequestTypeACRepository,
    private readonly requestTypeBARepository: RequestTypeBARepository,
    private readonly requestTypeBBRepository: RequestTypeBBRepository,
    private readonly requestTypeBCRepository: RequestTypeBCRepository,
    private readonly requestTypeCARepository: RequestTypeCARepository,
    private readonly requestTypeCBRepository: RequestTypeCBRepository,
    private readonly requestTypeCCRepository: RequestTypeCCRepository,
    private readonly loggerService: LoggerService,
  ) {}

  private setAddData<T extends Request>(instance: T) {
    instance.additionalData1 = faker.animal.type();
    instance.additionalData2 = faker.animal.cow();
    instance.additionalData3 = faker.animal.cetacean();

    return instance;
  }

  public async createTypeAA(userId: string): Promise<RequestTypeAA> {
    const user = await this.usersService.findOneById(userId);
    this.loggerService.debug(this.createTypeAA.name, user);

    const requestTypeAA = this.setAddData(new RequestTypeAA());
    requestTypeAA.specificProperty1 = faker.company.name();
    requestTypeAA.user = user;

    this.loggerService.debug(this.createTypeAA.name, requestTypeAA);

    const query = this.requestTypeAARepository.save(requestTypeAA).then((e) => e);

    return this.requestTypeAARepository.save(requestTypeAA);
  }

  public async createTypeAB() {
    const requestTypeB = this.setAddData(new RequestTypeAB());
    requestTypeB.specificProperty2 = faker.company.name();

    return this.requestTypeABRepository.save(requestTypeB);
  }

  public async createTypeAC() {
    const requestTypeC = this.setAddData(new RequestTypeAC());
    requestTypeC.specificProperty3 = faker.company.name();

    return this.requestTypeACRepository.save(requestTypeC);
  }

  public async createTypeBA(): Promise<RequestTypeBA> {
    const requestTypeBA = this.setAddData(new RequestTypeBA());
    requestTypeBA.specificProperty4 = faker.company.name();

    return this.requestTypeBARepository.save(requestTypeBA);
  }

  public async createTypeBB(): Promise<RequestTypeBB> {
    const requestTypeBB = this.setAddData(new RequestTypeBB());
    requestTypeBB.specificProperty5 = faker.company.name();

    return this.requestTypeBBRepository.save(requestTypeBB);
  }

  public async createTypeBC(): Promise<RequestTypeBC> {
    const requestTypeBC = this.setAddData(new RequestTypeBC());
    requestTypeBC.specificProperty6 = faker.company.name();

    return this.requestTypeBCRepository.save(requestTypeBC);
  }

  public async createTypeCA(): Promise<RequestTypeCA> {
    const requestTypeCA = this.setAddData(new RequestTypeCA());
    requestTypeCA.specificProperty7 = faker.company.name();

    return this.requestTypeCARepository.save(requestTypeCA);
  }

  public async createTypeCB(): Promise<RequestTypeCB> {
    const requestTypeCB = this.setAddData(new RequestTypeCB());
    requestTypeCB.specificProperty8 = faker.company.name();

    return this.requestTypeCBRepository.save(requestTypeCB);
  }

  public async createTypeCC(): Promise<RequestTypeCC> {
    const project = await this.projectsService.findOne('e947ebee-3ba3-431b-9942-cdda14e2cd8e');

    const requestTypeCC = this.setAddData(new RequestTypeCC());
    requestTypeCC.specificProperty9 = faker.company.name();
    requestTypeCC.project = project;

    return this.requestTypeCCRepository.save(requestTypeCC);
  }

  public async findAll() {
    const list = await this.requestRepository.find({ relations: { user: true } });
    list.forEach((e) => console.log(e.constructor.name, e));

    list.map((e) => {
      if (Request.isRequestTypeAA(e)) {
        const test = e;
      }

      if (Request.isRequestTypeAB(e)) {
        const test = e;
      }

      if (Request.isRequestTypeAC(e)) {
        const test = e;
      }
    });
  }
}
