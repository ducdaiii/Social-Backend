import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProjectContribution, ProjectContributionDocument } from '../schemas/contribution.schema';
import { CreateProjectContributionDto } from '../dto/contribution/create-project-contribution.dto';
import { UpdateProjectContributionDto } from '../dto/contribution/update-project-contribution.dto';

@Injectable()
export class ProjectContributionService {
  constructor(
    @InjectModel(ProjectContribution.name) private projectContributionModel: Model<ProjectContributionDocument>,
  ) {}

  async create(createDto: CreateProjectContributionDto): Promise<ProjectContribution> {
    const created = new this.projectContributionModel(createDto);
    return created.save();
  }

  async findAll(): Promise<ProjectContribution[]> {
    return this.projectContributionModel.find().exec();
  }

  async findById(id: string): Promise<ProjectContribution> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const found = await this.projectContributionModel.findById(id).exec();
    if (!found) throw new NotFoundException(`ProjectContribution with ID ${id} not found`);
    return found;
  }

  async update(id: string, updateDto: UpdateProjectContributionDto): Promise<ProjectContribution> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const updated = await this.projectContributionModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`ProjectContribution with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const result = await this.projectContributionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`ProjectContribution with ID ${id} not found`);
  }
}