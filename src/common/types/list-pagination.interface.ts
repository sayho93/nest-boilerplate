export interface ListPagination<T> {
  totalCount: number;
  list: Array<T>;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
}
