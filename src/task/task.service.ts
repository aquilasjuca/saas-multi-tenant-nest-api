import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../user/entities/user.entity';
import { JwtPayload } from '../auth/types/jws-payload.type';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateTaskDto, user: JwtPayload) {
    const userExists = await this.userRepository.findOne({
      where: { id: user.sub },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const task = this.taskRepository.create({
      ...dto,
      userId: user.sub,
      companyId: user.companyId,
    });

    return this.taskRepository.save(task);
  }

  async findAll(user: JwtPayload) {
    return this.taskRepository.find({
      where: {
        companyId: user.companyId,
      },
    });
  }
}
