import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreatePartDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  files?: string[];

  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsOptional()
  createdBy?: Types.ObjectId;

  @IsNotEmpty()
  project: Types.ObjectId;

  @IsArray()
  @IsOptional()
  progressUpdates?: Types.ObjectId[];
}
