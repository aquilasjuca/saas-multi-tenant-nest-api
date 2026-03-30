import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/types/jws-payload.type';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() dto: CreateTaskDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.taskService.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: Request & { user: JwtPayload }) {
    return this.taskService.findAll(req.user);
  }
}
