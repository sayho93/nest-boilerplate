import { IsString } from 'class-validator';
import { BaseUuidEntity } from '../../database/base.entity';
import { User } from '../../users/user.entity';

export class SignUpDto implements Omit<User, keyof BaseUuidEntity | 'auths' | 'role' | 'credits'> {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  alias: string;

  @IsString()
  phone: string;
}
