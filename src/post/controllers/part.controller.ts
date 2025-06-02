import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PartService } from '../services/part.service';
import { CreatePartDto } from '../dto/parts/create-part.dto';
import { UpdatePartDto } from '../dto/parts/update-part.dto';

@Controller('parts')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Post()
  create(@Body() createDto: CreatePartDto) {
    return this.partService.create(createDto);
  }

  @Get()
  findAll() {
    return this.partService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePartDto) {
    return this.partService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partService.remove(id);
  }
}