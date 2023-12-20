import { TApiResponseAsync } from '@app/common/types';
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
