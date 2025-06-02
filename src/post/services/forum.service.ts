import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectForum, ProjectForumDocument } from '../schemas/forum.schema';
import { CreateProjectForumDto } from '../dto/forum/create-project-forum.dto';
import { UpdateProjectForumDto } from '../dto/forum/update-project-forum.dto';

@Injectable()
export class ProjectForumService {
  constructor(
    @InjectModel(ProjectForum.name) private projectForumModel: Model<ProjectForumDocument>,
  ) {}

  async create(createDto: CreateProjectForumDto): Promise<ProjectForum> {
    const created = new this.projectForumModel(createDto);
    return created.save();
  }

  async findAll(): Promise<ProjectForum[]> {
    return this.projectForumModel.find().exec();
  }

  async findById(id: string): Promise<ProjectForum> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const found = await this.projectForumModel.findById(id).exec();
    if (!found) throw new NotFoundException(`ProjectForum with ID ${id} not found`);
    return found;
  }

  async update(id: string, updateDto: UpdateProjectForumDto): Promise<ProjectForum> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const updated = await this.projectForumModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`ProjectForum with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const result = await this.projectForumModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`ProjectForum with ID ${id} not found`);
  }
}
