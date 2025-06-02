import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Post, PostDocument } from '../schemas/post.schema';
import { CreatePostDto } from '../dto/posts/create-post.dto';
import { UpdatePostDto } from '../dto/posts/update-post.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Post.name) private projectModel: Model<PostDocument>,
  ) {}

  async create(createProjectDto: CreatePostDto): Promise<Post> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findAll(): Promise<Post[]> {
    return this.projectModel.find().exec();
  }

  async findById(id: string): Promise<Post> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid project ID');
    const project = await this.projectModel.findById(id)
      .populate('roles')
      .populate('parts')
      .populate('joinRequests')
      .populate('contributions')
      .populate('forum')
      .exec();
    if (!project) throw new NotFoundException(`Project with ID ${id} not found`);
    return project;
  }

  async update(id: string, updateProjectDto: UpdatePostDto): Promise<Post> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid project ID');
    const updated = await this.projectModel.findByIdAndUpdate(id, updateProjectDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Project with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid project ID');
    const result = await this.projectModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Project with ID ${id} not found`);
  }
}