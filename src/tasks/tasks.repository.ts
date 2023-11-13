import { Task } from '@app/common/entities';
import { AbstractRepository } from '@app/infra';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TasksRepository extends AbstractRepository<Task> {
  protected readonly logger = new Logger(TasksRepository.name);

  constructor(
    @InjectRepository(Task) readonly entityRepository: Repository<Task>,
    readonly entityManager: EntityManager
  ) {
    super(entityRepository, entityManager);
  }
}
