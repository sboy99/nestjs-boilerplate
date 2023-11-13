import { FilteringQuery, PaginationQuery, SortingQuery } from '@app/common/decorators';
import type { Task } from '@app/common/entities';
import { TApiResponseAsync, TFilteringQuery, TPaginationQuery, TSortingQuery } from '@app/common/types';
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateTaskDto } from './dtos/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): TApiResponseAsync<Task> {
    await this.tasksService.create(createTaskDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Task created successfully',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  listTasks(
    @PaginationQuery() pagination: TPaginationQuery,
    @SortingQuery<Task>(['id', 'createdAt', 'updatedAt', 'taskName']) sorts: TSortingQuery<Task>,
    @FilteringQuery<Task>(['id', 'createdAt', 'taskName', 'priority']) filters: TFilteringQuery<Task>
  ) {
    return this.tasksService.list({
      pagination,
      filters,
      sorts,
    });
  }
}
