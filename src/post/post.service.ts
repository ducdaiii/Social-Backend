import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  async findAllRandom(): Promise<Post[]> {
    return this.postModel.aggregate([
      { $sample: { size: 1000 } } 
    ]);
  }

  async findAllpostUser(): Promise<Post[]> {
    return this.postModel.find().populate('author', 'username').exec();
  }

  async findOne(id: string): Promise<Post> {
    return this.postModel.findById(id).populate('author', 'username').exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Post> {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  async likePost(postId, userId) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new Error('Post not found');

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    }

    return post.save();
  }
}
