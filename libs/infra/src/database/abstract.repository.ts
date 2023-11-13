import type { TPaginatedResource, TQuery } from '@app/common/types';
import { getOrder, getWhere } from '@app/common/utils';
import type { Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import type { EntityManager, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import type { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly entityRepository: Repository<T>,
    protected readonly entityManager: EntityManager
  ) {}

  async create(entity: T): Promise<T> {
    const cEntity = await this.entityManager.save(entity);
    this.logger.log(`Created new instance: ${JSON.stringify(cEntity)}`);
    return cEntity;
  }

  async findOne(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, relations });

    if (!entity) {
      this.logger.warn('Document not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return entity;
  }

  async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>) {
    const updateResult = await this.entityRepository.update(where, partialEntity);

    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async list(query: TQuery<T>): Promise<TPaginatedResource<T>> {
    const where = getWhere(query?.filters);
    const order = getOrder(query?.sorts);

    const { limit, offset, page, size } = query.pagination;

    const [entities, count] = await this.entityRepository.findAndCount({
      where: {
        ...where,
        isDeleted: false as any,
      },
      order,
      take: limit,
      skip: offset,
    });

    return {
      count,
      page,
      size,
      lastPage: Math.ceil(count / size),
      data: entities,
    };
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.entityRepository.delete(where);
  }
}
