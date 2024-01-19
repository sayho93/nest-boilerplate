import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ConfigsService } from '../configs/configs.service';

@Controller('users')
export class UsersController {
  public constructor(
    private readonly usersService: UsersService,
    private readonly configsService: ConfigsService,
  ) {}

  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  public findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  public update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
