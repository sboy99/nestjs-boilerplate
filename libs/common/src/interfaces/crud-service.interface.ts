import type { AbstractEntity } from '@app/infra';

import type { TPaginatedResource, TQuery } from '../types';

export interface ICrudService<T extends AbstractEntity<T>> {
  create(createDto: Partial<T>): Promise<T>;
  list(query: TQuery<T>): Promise<TPaginatedResource<T>>;
  read(where: Partial<T>): Promise<T>;
  update(id: number, updateDto: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}
