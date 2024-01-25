import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Version } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ConfigsService } from '../configs/configs.service';

@Controller('/users')
export class UsersController {
  public constructor(
    private readonly usersService: UsersService,
    private readonly configsService: ConfigsService,
  ) {}

  @Version('1')
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Version('1')
  @Get()
  public async findAll(@Query() findUserDto: FindUsersDto) {
    return this.usersService.findMany(findUserDto);
  }

  @Version('1')
  @Get(':id')
  public async findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Version('1')
  @Patch(':id')
  public async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(id, updateUserDto);
  }

  @Version('1')
  @Delete(':id')
  public async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
