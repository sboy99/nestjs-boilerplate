import { AbstractSearch } from '@app/common/abstracts';
import type { User } from '@app/common/models';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class UsersSearch extends AbstractSearch<User> {
  protected logger = new Logger(UsersSearch.name);

  constructor(protected readonly esService: ElasticsearchService) {
    super(esService, 'users');
  }
}
