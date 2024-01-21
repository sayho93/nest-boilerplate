import { Expose } from 'class-transformer';

interface ListPaginationConstructParam<T> {
  rows: T[];
  totalCount: number;
  page: number;
  limit: number;
}

export class ListPagination<T> {
  public totalCount: number;
  public rows: Array<T>;
  public page: number;
  public limit: number;

  public constructor({ rows, totalCount, page, limit }: ListPaginationConstructParam<T>) {
    this.totalCount = totalCount;
    this.rows = rows;
    this.page = page;
    this.limit = limit;
  }

  @Expose()
  public get totalPages(): number {
    return Math.ceil(this.totalCount / this.limit);
  }

  @Expose()
  public get hasNext(): boolean {
    return this.totalPages > this.page;
  }

  @Expose()
  public get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
