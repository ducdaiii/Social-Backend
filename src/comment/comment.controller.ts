import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { EditGuard } from 'src/guard/edit.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentsService: CommentService) {}

  @Post()
  async create(@Body() { postId, userId, content }) {
    return this.commentsService.create(postId, userId, content);
  }

  @Get(':postId')
  async findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Delete(':commentId')
  @UseGuards(EditGuard)
  async deleteComment(@Param('commentId') commentId: string) {
    return this.commentsService.deleteComment(commentId);
  }
}
