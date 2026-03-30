import { IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { Status } from '../enums/status.enum';

export class GetTasksDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
