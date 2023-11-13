import { AbstractEntity } from '@app/infra';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TaskPriority } from '../enums';
import { User } from './user.entity';

@Entity('tasks')
export class Task extends AbstractEntity<Task> {
  @Column()
  taskName: string;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.NA })
  prority: TaskPriority;

  @ManyToOne(() => User, (u) => u.tasks)
  @JoinColumn()
  createdBy: User;
}
