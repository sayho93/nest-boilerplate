import { EntityManager } from 'typeorm';

export interface AlsStorage extends Record<string, any> {
  requestId?: string;
  entityManager?: EntityManager;
}
