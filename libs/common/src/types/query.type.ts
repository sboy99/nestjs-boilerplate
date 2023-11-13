import type { AbstractEntity } from '@app/infra';

import type { FilterRule } from '../enums';

export type TPaginationQuery = {
  page: number;
  limit: number;
  size: number;
  offset: number;
};

export type TFilteringQuery<T extends AbstractEntity<T>> = Array<{
  property: keyof T;
  rule: FilterRule;
  value: string;
}>;

export type TSortingQuery<T extends AbstractEntity<T>> = Array<{
  property: keyof T;
  direction: 'asc' | 'desc';
}>;

export type TQuery<T extends AbstractEntity<T>> = {
  pagination: TPaginationQuery;
  sorts?: TSortingQuery<T>;
  filters?: TFilteringQuery<T>;
};
