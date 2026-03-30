import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/types/jws-payload.type';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
  findAll(
    @Req() req: Request & { user: JwtPayload },
    @Query() query: GetTasksDto,
  ) {
    return this.taskService.findAll(req.user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.taskService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.taskService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.taskService.remove(id, req.user);
  }
}
