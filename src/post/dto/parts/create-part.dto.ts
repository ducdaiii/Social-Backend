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

  @IsEnum(['idea', 'in-progress', 'completed'])
  @IsOptional()
  status?: 'idea' | 'in-progress' | 'completed';

  @IsMongoId()
  @IsOptional()
  createdBy?: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  project: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  progressUpdates?: Types.ObjectId[];
}