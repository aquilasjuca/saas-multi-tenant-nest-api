import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
