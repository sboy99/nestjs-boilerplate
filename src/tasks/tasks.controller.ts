import { FilteringQuery, PaginationQuery, PopulationQuery, SelectionQuery, SortingQuery } from '@app/common/decorators';
import type { Task } from '@app/common/entities';
import type { TPaginatedResource } from '@app/common/types';
import {
  TApiResponseAsync,
  TFilteringQuery,
  TPaginationQuery,
  TPopulationQuery,
  TSelectionQuery,
  TSortingQuery,
} from '@app/common/types';
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
  async listTasks(
    @PaginationQuery() pagination: TPaginationQuery,
    @SortingQuery<Task>({ sortableFields: ['id', 'createdAt', 'updatedAt', 'taskName'] })
    sorts: TSortingQuery<Task>,
    @FilteringQuery<Task>({ filterableFields: ['id', 'createdAt', 'taskName', 'priority'] })
    filters: TFilteringQuery<Task>,
    @PopulationQuery<Task>({ populatableFields: ['createdBy'], defaultPopulate: ['createdBy'] })
    populate: TPopulationQuery<Task>,
    @SelectionQuery<Task>({
      selectableFields: [
        'id',
        'priority',
        'taskName',
        'createdAt',
        'updatedAt',
        'createdBy.id',
        'createdBy.email',
        'createdBy.fullName',
      ],
      defaultSelected: [
        'id',
        'priority',
        'taskName',
        'createdAt',
        'createdBy.id',
        'createdBy.email',
        'createdBy.fullName',
      ],
    })
    select: TSelectionQuery<Task>
  ): TApiResponseAsync<TPaginatedResource<Task>> {
    const paginatedTasks = await this.tasksService.list({
      pagination,
      filters,
      sorts,
      select,
      populate,
    });

    return {
      statusCode: HttpStatus.OK,
      message: `Total ${paginatedTasks.count} results found`,
      data: paginatedTasks,
    };
  }
}
