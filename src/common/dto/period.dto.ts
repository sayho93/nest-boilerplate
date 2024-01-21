import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class PeriodDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endAt: Date;

  protected constructor() {}
}
