import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../user/entities/user.entity';
import { JwtPayload } from '../auth/types/jws-payload.type';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindOptionsWhere } from 'typeorm';

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

  async findAll(user: JwtPayload, query: GetTasksDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const where: FindOptionsWhere<Task> = {
      companyId: user.companyId,
    };

    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await this.taskRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: JwtPayload) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.companyId !== user.companyId || task.userId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, user: JwtPayload) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.companyId !== user.companyId || task.userId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }

    Object.assign(task, dto);

    return this.taskRepository.save(task);
  }

  async remove(id: string, user: JwtPayload) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.companyId !== user.companyId || task.userId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }

    await this.taskRepository.remove(task);

    return { message: 'Task deleted successfully' };
  }
}
