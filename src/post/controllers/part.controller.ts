import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { PartService } from '../services/part.service';
import { CreatePartDto } from '../dto/parts/create-part.dto';
import { UpdatePartDto } from '../dto/parts/update-part.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('parts')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'image/',
          'video/',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        const isValid = allowedTypes.some((type) =>
          file.mimetype.startsWith(type),
        );
        if (!isValid) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh, video hoặc tài liệu'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createDto: CreatePartDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.partService.create(createDto, file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partService.findById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'image/',
          'video/',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        const isValid = allowedTypes.some((type) =>
          file.mimetype.startsWith(type),
        );
        if (!isValid) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh, video hoặc tài liệu'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePartDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.partService.update(id, updateDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partService.remove(id);
  }
}
