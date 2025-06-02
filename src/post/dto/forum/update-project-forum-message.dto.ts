import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectForumMessageDto } from './create-project-forum-message.dto';

export class UpdateProjectForumMessageDto extends PartialType(CreateProjectForumMessageDto) {}