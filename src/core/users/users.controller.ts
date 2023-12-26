import {
  PaginationQuery,
  SelectionQuery,
  SortingQuery,
} from '@app/common/decorators';
import type { User } from '@app/common/models';
import type { TPaginatedResource } from '@app/common/types';
import {
  TApiResponseAsync,
  TPaginationQuery,
  TSelectionQuery,
  TSortingQuery,
} from '@app/common/types';
import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  public async listUsers(
    @PaginationQuery() pagination: TPaginationQuery,
    @SelectionQuery<User>({
      defaultSelected: ['_id', 'fullName', 'username', 'avatar', 'createdAt'],
      selectableFields: [
        '_id',
        'uuid',
        'fullName',
        'username',
        'avatar',
        'isBlocked',
        'createdAt',
        'updatedAt',
      ],
    })
    select: TSelectionQuery<User>,
    @SortingQuery<User>({
      sortableFields: ['fullName', 'isBlocked', 'createdAt', 'updatedAt'],
    })
    sort: TSortingQuery<User>
  ): TApiResponseAsync<TPaginatedResource<User>> {
    const usersList = await this.usersService.list({
      pagination,
      select,
      sort,
    });
    return {
      statusCode: HttpStatus.OK,
      data: usersList,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('seed')
  public async seedUsers(): TApiResponseAsync {
    await this.usersService.seed();

    return {
      statusCode: HttpStatus.OK,
      message: 'Seeded users successfully',
    };
  }
}
