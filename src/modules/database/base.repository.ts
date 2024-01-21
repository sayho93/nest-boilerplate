import { ClassConstructor, plainToInstance } from 'class-transformer';
import { DataSource, DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './base.entity';
import { ListPagination } from '../../common/abstracts/pagination';
import { LoggerService } from '../logger/logger.service';

export abstract class FundamentalRepository<T extends BaseEntity> {
  protected abstract readonly dataSource: DataSource;
  protected abstract readonly classType: ClassConstructor<T>;
  protected abstract readonly loggerService: LoggerService;

  protected get txManager(): EntityManager | undefined {
    return undefined;
  }
}

export abstract class BaseRepository<T extends BaseEntity> extends FundamentalRepository<T> {
  protected constructor(protected readonly classType: ClassConstructor<T>) {
    super();
  }

  protected get repository(): Repository<T> {
    if (this.txManager) return this.txManager.getRepository(this.classType);

    return this.dataSource.getRepository(this.classType);
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    const row = await this.repository.save(data);

    return plainToInstance(this.classType, row);
  }

  public async findOneById(id: number): Promise<T | null> {
    const row = this.repository.findOneBy({ id } as FindOptionsWhere<T>);

    return plainToInstance(this.classType, row);
  }

  public async findOneByCondition(filterCondition: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null> {
    const row = this.repository.findOne({ where: filterCondition });

    return plainToInstance(this.classType, row);
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return this.repository.find(relations);
  }

  public async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    const [rows, count] = await this.repository.findAndCount({
      order: { createdAt: -1 } as FindOptionsOrder<T>,
      ...options,
    });

    return [plainToInstance(this.classType, rows), count];
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    const rows = await this.repository.find({
      order: { createdAt: -1 } as FindOptionsOrder<T>,
      ...options,
    });
    return plainToInstance(this.classType, rows);
  }

  public async findAllPaginated(page: number, limit: number, options: FindManyOptions<T>): Promise<ListPagination<T>> {
    options.skip = (page - 1) * limit;
    options.take = limit;

    const [rows, totalCount] = await this.findAndCount(options);

    return new ListPagination({ rows, totalCount, page, limit });
  }

  public async updateOne(id: number, partialEntity: QueryDeepPartialEntity<T>): Promise<T | null> {
    const updateResult = await this.repository.update(id, partialEntity);
    if (!updateResult.affected) {
      this.loggerService.error(this.updateOne.name, updateResult, 'not affected');
      return null;
    }
    this.loggerService.info(this.updateOne.name, updateResult);

    //! UpdateResult.raw is empty [https://github.com/typeorm/typeorm/issues/2415]
    // return plainToInstance(this.classType, updateResult.raw[0]);
    return this.findOneById(id);
  }

  public async remove(ids: number | number[]): Promise<boolean> {
    const deleteResult = await this.repository.delete(ids);
    this.loggerService.debug(this.remove.name, deleteResult);

    const targetCount = Array.isArray(ids) ? ids.length : 1;
    if (deleteResult.affected !== targetCount) {
      this.loggerService.error(this.remove.name, deleteResult, 'affected count does not match');
      return false;
    }

    return true;
  }
}
