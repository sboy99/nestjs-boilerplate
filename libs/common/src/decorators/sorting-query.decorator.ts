import type { AbstractEntity } from '@app/infra';
import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import type { TSortingQuery } from '../types';

export const SortingQuery = createParamDecorator(
  <T extends AbstractEntity<T>>(validParams: Array<keyof T>, ctx: ExecutionContext): TSortingQuery<T> => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const sortString: string = req?.query?.sort ? req.query?.sort.toString() : 'createdAt:desc';

    return sortString.split('&&').map((sort) => {
      // check if the valid params sent is an array
      if (!Array.isArray(validParams)) throw new BadRequestException('Invalid sort parameter');

      // check the format of the sort query param
      const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
      if (!sort.match(sortPattern)) throw new BadRequestException('Invalid sort parameter');

      // extract the property name and direction and check if they are valid
      const [property, direction] = sort.split(':') as [keyof T, 'asc' | 'desc'];
      if (!validParams.includes(property as keyof T))
        throw new BadRequestException(`Invalid sort property: ${property.toString()}`);

      return { property, direction };
    });
  }
);
