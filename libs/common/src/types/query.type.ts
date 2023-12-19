import type { AbstractDocument } from '@app/infra';
import type { ProjectionType } from 'mongoose';

import type { FilterRule } from '../enums';

export type TPaginationQuery = {
  page: number;
  limit: number;
  size: number;
  offset: number;
};

export type TFilteringQuery<T extends AbstractDocument<T>> = Array<{
  property: keyof T;
  rule: FilterRule;
  value: string;
}>;

export type TSortingQuery<T extends AbstractDocument<T>> = Array<{
  property: keyof T;
  direction: 'asc' | 'desc';
}>;

export type TSelectionQuery<T extends AbstractDocument<T>> = ProjectionType<T>;

export type TQuery<T extends AbstractDocument<T>> = {
  pagination: TPaginationQuery;
  select?: TSelectionQuery<T>;
  sorts?: TSortingQuery<T>;
  filters?: TFilteringQuery<T>;
};
