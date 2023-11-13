import { Task } from '@app/common/entities';
import type { ICrudService } from '@app/common/interfaces';
import type { TPaginatedResource, TQuery } from '@app/common/types';
import { Injectable } from '@nestjs/common';

import type { CreateTaskDto } from './dtos/create-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService implements ICrudService<Task> {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.create(
      new Task({
        ...createTaskDto,
        createdBy: {
          id: createTaskDto.creatorId,
        },
      })
    );
    return task;
  }

  async list(query: TQuery<Task>): Promise<TPaginatedResource<Task>> {
    return this.tasksRepository.list(query);
  }

  read(where: Partial<Task>): Promise<Task> {
    throw new Error('Method not implemented.');
  }
  update(id: number, updateDto: Partial<Task>): Promise<Task> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
