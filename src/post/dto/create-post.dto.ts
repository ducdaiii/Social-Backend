import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsNotEmpty()
  author: Types.ObjectId;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  videos?: string[];

  @IsOptional()
  @IsArray()
  files?: string[];
}
