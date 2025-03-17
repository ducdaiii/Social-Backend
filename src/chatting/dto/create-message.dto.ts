import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  sender: string;  

  @IsNotEmpty()
  @IsString()
  receiver: string; 

  @IsNotEmpty()
  @IsString()
  content: string;
}