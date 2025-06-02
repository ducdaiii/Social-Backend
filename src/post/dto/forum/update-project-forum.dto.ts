import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectForumDto } from './create-project-forum.dto';

export class UpdateProjectForumDto extends PartialType(CreateProjectForumDto) {}