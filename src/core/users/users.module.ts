import { UserModel } from '@app/common/models';
import { DatabaseModule } from '@app/infra/database';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule.forFeature(UserModel)],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
