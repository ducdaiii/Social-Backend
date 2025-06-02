import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectProgressUpdateDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsOptional()
  updatedBy?: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  part: Types.ObjectId;
}