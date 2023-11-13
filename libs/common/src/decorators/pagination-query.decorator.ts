import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import type { TPaginationQuery } from '../types';

export const PaginationQuery = createParamDecorator((data, ctx: ExecutionContext): TPaginationQuery => {
  const req = ctx.switchToHttp().getRequest<Request>();

  const page = req?.query?.page ? parseInt(req.query.page as string) : 1;
  const size = req?.query?.size ? parseInt(req.query.size as string) : 10;

  // check if page and size are valid
  if (isNaN(page) || page < 1 || isNaN(size) || size < 0) {
    throw new BadRequestException('Invalid pagination params');
  }
  // do not allow to fetch large slices of the dataset
  if (size > 100) {
    throw new BadRequestException('Invalid pagination params: Max size is 100');
  }

  // calculate pagination parameters
  const limit = size;
  const offset = (page - 1) * limit;
  return { page, limit, size, offset };
});
