import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectContributionDto } from './create-project-contribution.dto';

export class UpdateProjectContributionDto extends PartialType(CreateProjectContributionDto) {}