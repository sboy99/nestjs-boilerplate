import type { User } from '@app/common/entities';
import { TApiResponseAsync } from '@app/common/types';
import { Controller, Get, HttpStatus } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async listUsers(): TApiResponseAsync<User[]> {
    // const users = await this.userService.list();

    return {
      statusCode: HttpStatus.OK,
      message: `User retrieved successfully`,
      data: [],
    };
  }
}
