import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectJoinRequestDto } from './create-project-join-request.dto';

export class UpdateProjectJoinRequestDto extends PartialType(CreateProjectJoinRequestDto) {}