import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  sender: string;  

  @IsNotEmpty()
  @IsString()
  chatId: string; 

  @IsNotEmpty()
  @IsEnum(['User', 'Group'])
  chatType: 'User' | 'Group'; 

  @IsOptional()
  @IsString()
  content?: string; 

  @IsOptional()
  @IsEnum(['text', 'image', 'video', 'file'])
  type?: 'text' | 'image' | 'video' | 'file'; 

  @IsOptional()
  @IsString()
  fileUrl?: string; 
}