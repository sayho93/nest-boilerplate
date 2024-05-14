import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtPayload } from '../auth/auth.interface';
import { CurrentAuth } from '../auth/decorators/current-auth.decorator';

@Controller('/users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  public async findAll(@CurrentAuth() payload: JwtPayload, @Query() findUserDto: FindUsersDto) {
    const result = await this.usersService.findMany(findUserDto);
    try {
      const test2 = await this.usersService.findOneById('856be21d-81b7-476c-aff9-b32a02aa8d58');
      console.log(test2);
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
