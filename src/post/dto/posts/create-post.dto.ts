import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsNotEmpty()
  author: Types.ObjectId;

  @IsOptional()
  members?: Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  })
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString({ each: true })
  @IsOptional()
  videos?: string[];

  @IsString({ each: true })
  @IsOptional()
  files?: string[];

  @IsOptional()
  status?: string;

  @IsOptional()
  workingMode?: string;

  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  })
  location?: string[];

  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  })
  roles?: string[];

  @IsOptional()
  parts?: Types.ObjectId[];

  @IsOptional()
  joinRequests?: Types.ObjectId[];

  @IsOptional()
  contributions?: Types.ObjectId[];

  @IsOptional()
  forum?: Types.ObjectId;
}
