import { AbstractCacheRepository } from '@app/common/abstracts';
import { User } from '@app/common/models';
import { getRandomNumber } from '@app/common/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractCacheRepository<User> {
  protected logger = new Logger(UsersRepository.name);
  constructor(
    @InjectModel(User.name) protected readonly userModel: Model<User>,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache
  ) {
    super(userModel, cacheManager, User.name);
  }

  public async genarateUniqueName(name: string): Promise<string> {
    const genaratedUniqueName = name.toLowerCase().trim().replaceAll(' ', '');
    let uniqueName = genaratedUniqueName;
    while (true) {
      // lookup for the user name
      const doesExist = await this.lookUp({
        filterQuery: {
          username: uniqueName,
        },
      });
      if (!doesExist) return uniqueName;
      uniqueName = genaratedUniqueName + getRandomNumber(1000);
    }
  }
}
