import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity('task_attachments')
export class TaskAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @ManyToOne(() => Task, (task) => task.attachments, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @Column()
  taskId: string;

  @CreateDateColumn()
  createdAt: Date;
}
