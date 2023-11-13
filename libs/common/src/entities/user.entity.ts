import { AbstractEntity } from '@app/infra';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { Task } from './task.entity';

@Entity('users')
@Unique('unique_email', ['email'])
export class User extends AbstractEntity<User> {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (t) => t.createdBy, { onDelete: 'SET NULL' })
  tasks: Task[];
}
