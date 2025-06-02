import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectJoinRequestDto {
  @IsNotEmpty()
  user: Types.ObjectId;

  @IsNotEmpty()
  project: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  profile: string;

  @IsEnum(['pending', 'approved', 'rejected'])
  @IsOptional()
  status?: 'pending' | 'approved' | 'rejected';

  @IsString()
  @IsOptional()
  note?: string;
}