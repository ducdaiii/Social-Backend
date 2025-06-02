import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectProgressUpdate, ProjectProgressUpdateDocument } from '../schemas/progress.schema';
import { CreateProjectProgressUpdateDto } from '../dto/progress/create-project-progress-update.dto';
import { UpdateProjectProgressUpdateDto } from '../dto/progress/update-project-progress-update.dto';

@Injectable()
export class ProjectProgressUpdateService {
  constructor(
    @InjectModel(ProjectProgressUpdate.name) private progressUpdateModel: Model<ProjectProgressUpdateDocument>,
  ) {}

  async create(createDto: CreateProjectProgressUpdateDto): Promise<ProjectProgressUpdate> {
    const created = new this.progressUpdateModel(createDto);
    return created.save();
  }

  async findAll(): Promise<ProjectProgressUpdate[]> {
    return this.progressUpdateModel.find().exec();
  }

  async findById(id: string): Promise<ProjectProgressUpdate> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const found = await this.progressUpdateModel.findById(id).exec();
    if (!found) throw new NotFoundException(`ProjectProgressUpdate with ID ${id} not found`);
    return found;
  }

  async update(id: string, updateDto: UpdateProjectProgressUpdateDto): Promise<ProjectProgressUpdate> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const updated = await this.progressUpdateModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`ProjectProgressUpdate with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const result = await this.progressUpdateModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`ProjectProgressUpdate with ID ${id} not found`);
  }
}
