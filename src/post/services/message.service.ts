import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectForumMessage, ProjectForumMessageDocument } from '../schemas/forum.message.schema';
import { CreateProjectForumMessageDto } from '../dto/forum/create-project-forum-message.dto';
import { UpdateProjectForumMessageDto } from '../dto/forum/update-project-forum-message.dto';

@Injectable()
export class ProjectForumMessageService {
  constructor(
    @InjectModel(ProjectForumMessage.name) private forumMessageModel: Model<ProjectForumMessageDocument>,
  ) {}

  async create(createDto: CreateProjectForumMessageDto): Promise<ProjectForumMessage> {
    const created = new this.forumMessageModel(createDto);
    return created.save();
  }

  async findAll(): Promise<ProjectForumMessage[]> {
    return this.forumMessageModel.find().exec();
  }

  async findById(id: string): Promise<ProjectForumMessage> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid forum message ID');
    const message = await this.forumMessageModel.findById(id).exec();
    if (!message) throw new NotFoundException(`Forum message with ID ${id} not found`);
    return message;
  }

  async update(id: string, updateDto: UpdateProjectForumMessageDto): Promise<ProjectForumMessage> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid forum message ID');
    const updated = await this.forumMessageModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Forum message with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid forum message ID');
    const result = await this.forumMessageModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Forum message with ID ${id} not found`);
  }
}