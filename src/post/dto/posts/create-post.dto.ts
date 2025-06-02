import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsMongoId()
  @IsNotEmpty()
  author: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  members?: Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

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

  @IsEnum(['remote', 'onsite', 'hybrid'])
  @IsOptional()
  workingMode?: 'remote' | 'onsite' | 'hybrid';

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  roles?: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  parts?: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  joinRequests?: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  contributions?: Types.ObjectId[];

  @IsMongoId()
  @IsOptional()
  forum?: Types.ObjectId;
}