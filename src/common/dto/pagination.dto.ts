import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { DefaultLimit, DefaultPage } from '../constants/pagination.constant';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public page: number = DefaultPage;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public limit: number = DefaultLimit;

  public get skip(): number {
    return (this.page - 1) * this.limit;
  }

  public get take(): number {
    return this.limit;
  }

  protected constructor() {}
}
