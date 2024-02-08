import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthType } from '../auth.interface';

export class SignInDto {
  @IsNotEmpty()
  @IsEnum(AuthType)
  type: AuthType;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}
