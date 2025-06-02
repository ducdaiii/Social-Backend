import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProjectRoleService } from '../services/role.service';
import { CreateProjectRoleDto } from '../dto/roles/create-project-role.dto';
import { UpdateProjectRoleDto } from '../dto/roles/update-project-role.dto';


@Controller('project-roles')
export class ProjectRoleController {
  constructor(private readonly service: ProjectRoleService) {}

  @Post()
  create(@Body() createDto: CreateProjectRoleDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectRoleDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
