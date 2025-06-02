import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProjectForumMessageService } from '../services/message.service';
import { CreateProjectForumMessageDto } from '../dto/forum/create-project-forum-message.dto';
import { UpdateProjectForumMessageDto } from '../dto/forum/update-project-forum-message.dto';


@Controller('project-forum-messages')
export class ProjectForumMessageController {
  constructor(private readonly service: ProjectForumMessageService) {}

  @Post()
  create(@Body() createDto: CreateProjectForumMessageDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectForumMessageDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
