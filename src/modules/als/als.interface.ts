import { QueryRunner } from 'typeorm';

export type AlsStorage = {
  requestId?: string;
  queryRunner?: QueryRunner;
};
