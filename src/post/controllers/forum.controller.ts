import { Controller, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { ProjectForumService } from '../services/forum.service';
import { UpdateProjectForumDto } from '../dto/forum/update-project-forum.dto';

@Controller('project-forums')
export class ProjectForumController {
  constructor(private readonly service: ProjectForumService) {}

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
