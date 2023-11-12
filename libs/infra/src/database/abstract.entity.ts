import { Column, CreateDateColumn, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity<TEntity> {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ default: false })
  isDeleted?: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: null })
  deletedAt?: Date | null;

  constructor(entity: TEntity) {
    Object.assign(this, entity);
  }
}
