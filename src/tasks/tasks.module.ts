import { Task, User } from '@app/common/entities';
import { DatabaseModule } from '@app/infra';
import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [DatabaseModule.forFeature([Task, User])],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
