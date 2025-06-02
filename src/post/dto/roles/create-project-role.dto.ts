import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProjectRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}