import { User } from '@app/common/models';
import type { TQuery } from '@app/common/types';
import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { UsersSearch } from './users.search';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersSearch: UsersSearch
  ) {}

  public async list(query: TQuery<User>) {
    return this.usersRepository.listWithCache({
      cacheOptions: {
        key: query,
        ttl: '5min',
        scope: 'list',
      },
      apiQuery: query,
    });
  }

  public async search(text: string) {
    const searchResults = await this.usersSearch.search({
      search: text,
      fields: ['fullName', 'username'],
    });

    return searchResults;
  }

  public async seed(round = 100) {
    const { faker } = await import('@faker-js/faker');
    for (let r = 0; r < round; r++) {
      const user = new User({
        avatar: faker.internet.avatar(),
        fullName: faker.internet.displayName(),
        username: faker.internet.userName(),
      });

      // save to DB
      const userDoc = await this.usersRepository.create({
        document: user,
      });

      // persist for search
      await this.usersSearch.create({
        doc: userDoc,
      });
    }
  }
}
