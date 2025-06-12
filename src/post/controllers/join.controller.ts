import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { ProjectJoinRequestService } from '../services/join.service';
import { CreateProjectJoinRequestDto } from '../dto/joins/create-project-join-request.dto';
import { UpdateProjectJoinRequestDto } from '../dto/joins/update-project-join-request.dto';

@Controller('join')
export class ProjectJoinRequestController {
  constructor(private readonly service: ProjectJoinRequestService) {}

  @Post()
  create(@Body() createDto: CreateProjectJoinRequestDto) {
    return this.service.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approveJoinRequest(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.rejectJoinRequest(id);
  }
}
