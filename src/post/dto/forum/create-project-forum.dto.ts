import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectForumDto {
  project: Types.ObjectId;

  @IsArray()
  @IsOptional()
  members?: Types.ObjectId[];

  @IsArray()
  @IsOptional()
  messages?: Types.ObjectId[];
}