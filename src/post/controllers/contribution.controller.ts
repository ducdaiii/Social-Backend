import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProjectContributionService } from '../services/contribution.service';
import { CreateProjectContributionDto } from '../dto/contribution/create-project-contribution.dto';
import { UpdateProjectContributionDto } from '../dto/contribution/update-project-contribution.dto';


@Controller('project-contributions')
export class ProjectContributionController {
  constructor(private readonly service: ProjectContributionService) {}

  @Post()
  create(@Body() createDto: CreateProjectContributionDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectContributionDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
