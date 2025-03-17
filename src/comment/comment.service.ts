import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schema/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(postId: string, userId: string, content: string) {
    const comment = new this.commentModel({
      post: postId,
      user: userId,
      content,
    });
    return comment.save();
  }

  async findByPost(postId: string) {
    return this.commentModel
      .find({ post: postId })
      .populate('user', 'username')
      .exec();
  }

  async deleteComment(commentId: string) {
    return this.commentModel.findByIdAndDelete(commentId).exec();
  }
}
