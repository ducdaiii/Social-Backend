import { IsBoolean, IsOptional, IsString, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectForumMessageDto {
  forum: Types.ObjectId;

  author: Types.ObjectId;

  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  replies?: Types.ObjectId[];

  @IsBoolean()
  @IsOptional()
  edited?: boolean;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}