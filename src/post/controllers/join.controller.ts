import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProjectJoinRequestService } from '../services/join.service';
import { CreateProjectJoinRequestDto } from '../dto/joins/create-project-join-request.dto';
import { UpdateProjectJoinRequestDto } from '../dto/joins/update-project-join-request.dto';


@Controller('project-join-requests')
export class ProjectJoinRequestController {
  constructor(private readonly service: ProjectJoinRequestService) {}

  @Post()
  create(@Body() createDto: CreateProjectJoinRequestDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectJoinRequestDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
