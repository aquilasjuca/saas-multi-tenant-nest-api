import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../auth/types/jws-payload.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: Request & { user: JwtPayload }) {
    return this.userService.findAll(req.user);
  }
}
