import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectJoinRequest, ProjectJoinRequestDocument } from '../schemas/join.schema';
import { CreateProjectJoinRequestDto } from '../dto/joins/create-project-join-request.dto';
import { UpdateProjectJoinRequestDto } from '../dto/joins/update-project-join-request.dto';

@Injectable()
export class ProjectJoinRequestService {
  constructor(
    @InjectModel(ProjectJoinRequest.name) private joinRequestModel: Model<ProjectJoinRequestDocument>,
  ) {}

  async create(createDto: CreateProjectJoinRequestDto): Promise<ProjectJoinRequest> {
    const created = new this.joinRequestModel(createDto);
    return created.save();
  }

  async findAll(): Promise<ProjectJoinRequest[]> {
    return this.joinRequestModel.find().exec();
  }

  async findById(id: string): Promise<ProjectJoinRequest> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const found = await this.joinRequestModel.findById(id).exec();
    if (!found) throw new NotFoundException(`ProjectJoinRequest with ID ${id} not found`);
    return found;
  }

  async update(id: string, updateDto: UpdateProjectJoinRequestDto): Promise<ProjectJoinRequest> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const updated = await this.joinRequestModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`ProjectJoinRequest with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const result = await this.joinRequestModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`ProjectJoinRequest with ID ${id} not found`);
  }
}