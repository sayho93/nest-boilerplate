import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthType } from '../auth.interface';

export class SignInDto {
  @IsNotEmpty()
  @IsEnum(AuthType)
  type: AuthType;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
