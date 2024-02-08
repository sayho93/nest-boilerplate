import { IsEnum, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BaseAutoIncrementEntity } from '../../database/base.entity';
import { User } from '../user.entity';
import { UserRole } from '../users.interface';

export class CreateUserDto implements Omit<User, keyof BaseAutoIncrementEntity | 'auths'> {
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  public firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(16)
  public lastName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(24)
  public alias: string;

  @IsEnum(UserRole)
  role: string;

  @IsOptional()
  @IsNumberString()
  @MinLength(10)
  @MaxLength(11)
  public phone: string | null = null;
}
