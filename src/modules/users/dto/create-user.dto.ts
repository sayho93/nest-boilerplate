import { IsEnum, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { EmailRegexp, PasswordRegexp } from '../../../common/constants/regexp.constant';
import { BaseEntity } from '../../database/base.entity';
import { UserRole, UsersEntity } from '../entities/usersEntity';

export class CreateUserDto implements Omit<UsersEntity, keyof BaseEntity> {
  @IsString()
  @Matches(EmailRegexp)
  public email: string;

  @IsString()
  @Matches(PasswordRegexp)
  public password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(24)
  public name: string;

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
