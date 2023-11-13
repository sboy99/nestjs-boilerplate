import type { AbstractEntity } from '@app/infra';
import type { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ILike, In, IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';

import { FilterRule } from '../enums';
import type { TFilteringQuery, TSortingQuery } from '../types';

export const getOrder = <T extends AbstractEntity<T>>(sort?: TSortingQuery<T>): FindOptionsOrder<T> => {
  if (!sort) return {};
  return sort.reduce<FindOptionsOrder<T>>((acc, curr) => {
    acc[curr.property as string] = curr.direction;
    return acc;
  }, {});
};

const getValueByRule = (rule: string, value: string) => {
  if (rule === FilterRule.IS_NULL) return IsNull();
  if (rule === FilterRule.IS_NOT_NULL) return Not(IsNull());
  if (rule === FilterRule.EQUALS) return value;
  if (rule === FilterRule.NOT_EQUALS) return Not(value);
  if (rule === FilterRule.GREATER_THAN) return MoreThan(value);
  if (rule === FilterRule.GREATER_THAN_OR_EQUALS) return MoreThanOrEqual(value);
  if (rule === FilterRule.LESS_THAN) return LessThan(value);
  if (rule === FilterRule.LESS_THAN_OR_EQUALS) return LessThanOrEqual(value);
  if (rule === FilterRule.LIKE) return ILike(`%${value}%`);
  if (rule === FilterRule.NOT_LIKE) return Not(ILike(`%${value}%`));
  if (rule === FilterRule.IN) return In(value.split(','));
  if (rule === FilterRule.NOT_IN) return Not(In(value.split(',')));
};

export const getWhere = <T extends AbstractEntity<T>>(filter?: TFilteringQuery<T>): FindOptionsWhere<T> => {
  if (!filter) return {};

  return filter.reduce<FindOptionsWhere<T>>((acc, curr) => {
    acc[curr.property as string] = getValueByRule(curr.rule, curr.value);
    return acc;
  }, {});
};
