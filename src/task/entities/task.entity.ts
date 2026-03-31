import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Status } from '../enums/status.enum';
import { OneToMany } from 'typeorm';
import { TaskAttachment } from '../../task-attachment/entities/task-attachment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column()
  companyId: string;

  @OneToMany(() => TaskAttachment, (attachment) => attachment.task)
  attachments: TaskAttachment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
