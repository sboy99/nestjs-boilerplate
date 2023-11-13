import type { AbstractEntity } from '@app/infra';

export interface ICrudService<T extends AbstractEntity<T>> {
  create(createDto: Partial<T>): Promise<T>;
  list(where?: Partial<T>): Promise<T[]>;
  read(where: Partial<T>): Promise<T>;
  update(id: number, updateDto: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}
