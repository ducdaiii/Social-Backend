import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProjectForumService } from '../services/forum.service';
import { CreateProjectForumDto } from '../dto/forum/create-project-forum.dto';
import { UpdateProjectForumDto } from '../dto/forum/update-project-forum.dto';


@Controller('project-forums')
export class ProjectForumController {
  constructor(private readonly service: ProjectForumService) {}

  @Post()
  create(@Body() createDto: CreateProjectForumDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectForumDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
