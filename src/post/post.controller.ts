import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { EditGuard } from 'src/guard/edit.guard';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const fileUrls = files.map((file) => `/Pictures/${file.filename}`);
    return this.postsService.create({ ...createPostDto, files: fileUrls });
  }

  @Get('random')
  async findAllRandom() {
    return this.postsService.findAllRandom();
  }

  @Get('me')
  findAllofUser() {
    return this.postsService.findAllpostUser();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(EditGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(EditGuard)
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @Put(':id/like')
  async likePost(@Param('id') id: string, @Body('userId') userId: string) {
    return this.postsService.likePost(id, userId);
  }
}
