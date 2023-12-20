import { User } from '@app/common/models';
import type { TQuery } from '@app/common/types';
import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async list(query: TQuery<User>) {
    return this.usersRepository.list({
      apiQuery: query,
    });
  }

  public async seed(round = 1000) {
    const { faker } = await import('@faker-js/faker');
    for (let r = 0; r < round; r++) {
      const user = new User({
        avatar: faker.internet.avatar(),
        fullName: faker.internet.displayName(),
        username: faker.internet.userName(),
      });

      await this.usersRepository.create({
        document: user,
      });
    }
  }
}
