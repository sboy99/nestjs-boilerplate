import { Task } from '@app/common/entities';
import { TaskPriority } from '@app/common/enums';
import { PickType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto extends PickType(Task, ['taskName', 'priority']) {
  @IsString()
  @IsNotEmpty()
  taskName: string;

  @IsNumber()
  @IsNotEmpty()
  creatorId: number;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.NA;
}
