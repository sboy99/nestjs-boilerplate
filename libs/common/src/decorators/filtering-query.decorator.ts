import type { AbstractEntity } from '@app/infra';
import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import { FilterRule } from '../enums';
import type { TFilteringQuery } from '../types';

type TFilterParams<T extends AbstractEntity<T>> = {
  filterableFields: Array<keyof T>;
};

export const FilteringQuery = createParamDecorator(
  <T extends AbstractEntity<T>>(
    filterParams: TFilterParams<T>,
    ctx: ExecutionContext
  ): TFilteringQuery<T> | undefined => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filterString: string | undefined = req.query?.filter as string;
    if (!filterString) return;

    const filterableFields = filterParams.filterableFields;

    // check if the valid params sent is an array
    if (!Array.isArray(filterableFields)) throw new BadRequestException('Invalid filter parameter');

    return filterString.split('&&').map((filter) => {
      // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
      if (
        !filter.match(/^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_,]+$/) &&
        !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)
      ) {
        throw new BadRequestException('Invalid filter parameter');
      }
      // extract the parameters and validate if the rule and the property are valid
      const [property, rule, value] = filter.split(':') as [keyof T, FilterRule, string];
      if (!filterableFields.includes(property as keyof T))
        throw new BadRequestException(`Invalid filter property: ${property.toString()}`);
      if (!Object.values(FilterRule).includes(rule as FilterRule))
        throw new BadRequestException(`Invalid filter rule: ${rule}`);

      return { property, rule, value };
    });
  }
);
