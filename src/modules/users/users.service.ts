import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/users.entity';
import { UsersRepository } from './users.repository';
import { createHash } from '../../common/utils/encrypt';
import { Propagation } from '../database/database.interface';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
  public constructor(
    private readonly usersRepository: UsersRepository,
    private readonly loggerService: LoggerService,
  ) {}

  @Transactional()
  public async create(createUserDto: CreateUserDto) {
    createUserDto.email = v4();

    createUserDto.password = await createHash(createUserDto.password);

    const user = await this.usersRepository.create(createUserDto);
    this.loggerService.debug(this.create.name, 'testing transaction');

    // await this.createForNestedTest();
    try {
      await this.createForNestedTest();
    } catch (err) {}

    // await this.createForNotSupportedTest();
    try {
      await this.createForNotSupportedTest();
    } catch (err) {}

    // throw new ServiceUnavailableException('test');

    return user;
  }

  // @Transactional()
  @Transactional({ propagation: Propagation.NESTED })
  private async createForNestedTest() {
    const user = new UsersEntity();
    user.email = new Date() + 'NESTED';
    user.name = faker.person.fullName();
    user.alias = faker.internet.displayName();
    user.password = v4();

    const result = await this.usersRepository.create(user);

    // throw new ServiceUnavailableException(`throw from ${this.createForNestedTest.name}`);

    return result;
  }

  @Transactional({ propagation: Propagation.NOT_SUPPORTED })
  // @Transactional({ propagation: Propagation.NESTED })
  private async createForNotSupportedTest() {
    const user = new UsersEntity();
    user.email = new Date() + 'NOT_SUPPORTED';
    user.name = faker.person.fullName();
    user.alias = faker.internet.displayName();
    user.password = v4();

    const result = await this.usersRepository.create(user);

    const newUser = new UsersEntity();
    newUser.email = user.email;
    newUser.name = faker.person.fullName();
    newUser.alias = faker.internet.displayName();
    newUser.password = v4();
    const result2 = await this.usersRepository.create(newUser);

    // throw new ServiceUnavailableException(`throw from ${this.createForNestedTest.name}`);

    return result;
  }

  @Transactional()
  public async findMany(findUserDto: FindUsersDto) {
    return this.usersRepository.findMany(findUserDto);
  }

  @Transactional()
  public async findOneById(id: number) {
    const user = await this.usersRepository.findOneById(id);
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  public async updateOne(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.name = 'update success';
    const user = await this.usersRepository.updateOne(id, updateUserDto);
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  @Transactional()
  public async remove(id: number) {
    const isDeleted = await this.usersRepository.remove(id);
    if (!isDeleted) throw new NotFoundException('user not found');
  }
}
