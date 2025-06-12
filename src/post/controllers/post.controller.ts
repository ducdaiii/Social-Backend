import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
  Query,
} from '@nestjs/common';
import { ProjectService } from '../services/post.service';
import { CreatePostDto } from '../dto/posts/create-post.dto';
import { UpdatePostDto } from '../dto/posts/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
    @Body() createDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectService.create(createDto, file);
  }

  @Get()
  findAll() {
    return this.projectService.findAllShuffle();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findById(id);
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
    @Body() updateDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectService.update(id, updateDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }

  @Get('author/:id')
  async getProjectsByAuthor(@Param('id') id: string) {
    return this.projectService.findByAuthor(id);
  }

  @Get('join/:id')
  async getProjectsJoin(@Param('id') id: string) {
    return this.projectService.findByMember(id);
  }
}
