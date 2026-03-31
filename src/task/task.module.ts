import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { TaskAttachment } from 'src/task-attachment/entities/task-attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskAttachment, User])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
