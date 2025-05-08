import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean; 

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seenBy?: string[]; 

  @IsOptional()
  @IsString()
  content?: string; 
}