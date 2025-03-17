import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsNotEmpty()
  content: string;
}
