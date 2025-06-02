import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectProgressUpdateDto } from './create-project-progress-update.dto';

export class UpdateProjectProgressUpdateDto extends PartialType(CreateProjectProgressUpdateDto) {}