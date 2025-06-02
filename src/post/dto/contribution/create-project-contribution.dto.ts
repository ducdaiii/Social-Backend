import { IsMongoId, IsString, IsOptional, IsIn } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectContributionDto {
  @IsMongoId()
  @IsOptional()
  user?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  project?: Types.ObjectId;

  @IsString()
  type: string;

  @IsString()
  content: string;

  @IsIn(['pending', 'approved', 'rejected'])
  @IsOptional()
  status?: 'pending' | 'approved' | 'rejected';
}