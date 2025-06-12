import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectJoinRequestDto {
  @IsNotEmpty()
  user: Types.ObjectId;

  @IsNotEmpty()
  project: Types.ObjectId;

  @IsNotEmpty()
  role: string;

  @IsEnum(['Pending', 'Approved', 'Rejected'])
  @IsOptional()
  status?: 'Pending' | 'Approved' | 'Rejected';
}
