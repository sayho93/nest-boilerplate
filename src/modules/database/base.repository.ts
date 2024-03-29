import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FundamentalEntity } from './base.entity';
import { ListPagination } from '../../common/abstracts/pagination';
import { LoggerService } from '../logger/logger.service';

export abstract class FundamentalRepository<T extends FundamentalEntity> {
  protected abstract readonly loggerService: LoggerService;
  private readonly originalEntityManager: EntityManager;

  protected constructor(
    private readonly dataSource: DataSource,
    protected readonly classType: ClassConstructor<T>,
  ) {
    this.originalEntityManager = dataSource.manager;
  }

  private get txManager(): EntityManager | undefined {
    return undefined;
  }

  protected get repository(): Repository<T> {
    if (this.txManager) {
      return this.txManager.getRepository(this.classType);
    }

    const newManager = this.dataSource.createEntityManager();
    return newManager.getRepository(this.classType);
  }
}

export abstract class BaseRepository<T extends FundamentalEntity> extends FundamentalRepository<T> {
  protected constructor(dataSource: DataSource, classType: ClassConstructor<T>) {
    super(dataSource, classType);
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    const row = await this.repository.save(data);

    return plainToInstance(this.classType, row);
  }

  public async findOneById(id: number | string): Promise<T | null> {
    const row = this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);

    return plainToInstance(this.classType, row);
  }

  public async findOneByCondition(findOneOptions: FindOneOptions<T>): Promise<T | null> {
    const row = this.repository.findOne(findOneOptions);

    return plainToInstance(this.classType, row);
  }

  public async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    const [rows, count] = await this.repository.findAndCount({
      order: { createdAt: -1 } as FindOptionsOrder<T>,
      ...options,
    });

    return [plainToInstance(this.classType, rows), count];
  }

  // public async findAndCountByQB() {
  //   const queryBuilder = await this.repository.createQueryBuilder().where();
  // }

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

  public async updateOne(id: string, partialEntity: QueryDeepPartialEntity<T>): Promise<T | null> {
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

  public async remove(ids: string | string[]): Promise<boolean> {
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
