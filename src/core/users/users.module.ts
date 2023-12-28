import { UserModel } from '@app/common/models';
import { DatabaseModule } from '@app/infra/database';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersSearch } from './users.search';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule.forFeature(UserModel)],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersSearch],
  exports: [UsersService],
})
export class UsersModule {}
