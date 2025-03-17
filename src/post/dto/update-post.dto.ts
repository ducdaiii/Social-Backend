import { IsOptional, IsArray } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  content?: string;

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