import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { RequestRepository } from './repositories/request.repository';
import { RequestTypeARepository } from './repositories/requestTypeA.repository';
import { RequestTypeBRepository } from './repositories/requestTypeB.repository';
import { RequestTypeCRepository } from './repositories/requestTypeC.repository';
import { RequestTypeA, RequestTypeB, Request, RequestTypeC } from './request.entity';
import { RequestType } from './request.interface';
import { LoggerService } from '../logger/logger.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequestService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly requestRepository: RequestRepository,
    private readonly requestTypeARepository: RequestTypeARepository,
    private readonly requestTypeBRepository: RequestTypeBRepository,
    private readonly requestTypeCRepository: RequestTypeCRepository,
    private readonly loggerService: LoggerService,
  ) {}

  private setAddData<T extends Request>(instance: T) {
    instance.additionalData1 = faker.animal.type();
    instance.additionalData2 = faker.animal.cow();
    instance.additionalData3 = faker.animal.cetacean();

    return instance;
  }

  public async createTypeA(): Promise<RequestTypeA> {
    const user = await this.usersService.findOneById('97974b23-48fe-417d-9b00-84627af77d02');

    const requestTypeA = this.setAddData(new RequestTypeA());
    requestTypeA.specificPropertyA = faker.company.name();
    requestTypeA.user = user;

    this.loggerService.debug(this.createTypeA.name, requestTypeA, 'for test');

    const result = await this.requestTypeARepository.save(requestTypeA);
    // const result = this.requestTypeARepository.create(requestTypeA);
    return result;
  }

  public async createTypeB() {
    const requestTypeB = this.setAddData(new RequestTypeB());
    requestTypeB.specificPropertyB = faker.company.name();

    // return this.requestRepository.save(requestTypeB);

    return this.requestTypeBRepository.save(requestTypeB);
  }

  public async createTypeC() {
    const requestTypeC = this.setAddData(new RequestTypeC());
    requestTypeC.specificPropertyC = faker.company.name();

    // return this.requestRepository.save(requestTypeB);

    return this.requestTypeCRepository.save(requestTypeC);
  }

  public async findAll() {
    const list = await this.requestRepository.find({ relations: { user: true } });

    list.forEach((e) => console.log(e.constructor.name, e));

    if (list[0].type === RequestType.TypeC) {
      const test = list[0];
    }

    list.map((e) => {
      switch (e.type) {
        case 'TYPE_A':
          const test = e;
          break;
        case 'TYPE_B':
          const test2 = e;
          break;
        case 'TYPE_C':
          const test3 = e;
      }
    });
  }

  public async findOneTypeA(id: number) {
    return `This action returns a #${id} request`;
  }

  public async findOneTypeB(id: number) {
    return `This action returns a #${id} request`;
  }
}
