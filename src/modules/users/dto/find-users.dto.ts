import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  searchText?: string;
}
