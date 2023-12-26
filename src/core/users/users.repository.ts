import { AbstractRepository } from '@app/common/abstracts';
import { User } from '@app/common/models';
import { getRandomNumber } from '@app/common/utils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected logger = new Logger(UsersRepository.name);
  constructor(
    @InjectModel(User.name) protected readonly userModel: Model<User>
  ) {
    super(userModel, User.name);
  }

  public async genarateUniqueName(name: string): Promise<string> {
    let uniqueName = name.trim().replaceAll(' ', '-');
    while (true) {
      // lookup for the user name
      const doesExist = await this.lookUp({
        filterQuery: {
          username: uniqueName,
        },
      });
      if (!doesExist) return uniqueName;
      uniqueName += '-' + getRandomNumber(1000);
    }
  }
}
