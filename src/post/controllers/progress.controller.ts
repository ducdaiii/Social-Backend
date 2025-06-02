import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProjectProgressUpdateService } from '../services/progress.service';
import { CreateProjectProgressUpdateDto } from '../dto/progress/create-project-progress-update.dto';
import { UpdateProjectProgressUpdateDto } from '../dto/progress/update-project-progress-update.dto';


@Controller('project-progress-updates')
export class ProjectProgressUpdateController {
  constructor(private readonly service: ProjectProgressUpdateService) {}

  @Post()
  create(@Body() createDto: CreateProjectProgressUpdateDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectProgressUpdateDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}