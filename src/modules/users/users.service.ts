import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { createHash } from '../../common/utils/encrypt';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
  public constructor(
    private readonly usersRepository: UsersRepository,
    private readonly loggerService: LoggerService,
  ) {}

  @Transactional()
  public async create(createUserDto: CreateUserDto) {
    createUserDto.password = await createHash(createUserDto.password);

    return await this.usersRepository.create(createUserDto);
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
