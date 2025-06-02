import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProjectRole, ProjectRoleDocument } from '../schemas/role.schema';
import { CreateProjectRoleDto } from '../dto/roles/create-project-role.dto';
import { UpdateProjectRoleDto } from '../dto/roles/update-project-role.dto';

@Injectable()
export class ProjectRoleService {
  constructor(
    @InjectModel(ProjectRole.name) private projectRoleModel: Model<ProjectRoleDocument>,
  ) {}

  async create(createDto: CreateProjectRoleDto): Promise<ProjectRole> {
    const created = new this.projectRoleModel(createDto);
    return created.save();
  }

  async findAll(): Promise<ProjectRole[]> {
    return this.projectRoleModel.find().exec();
  }

  async findById(id: string): Promise<ProjectRole> {
    const found = await this.projectRoleModel.findById(id).exec();
    if (!found) throw new NotFoundException(`ProjectRole with ID ${id} not found`);
    return found;
  }

  async update(id: string, updateDto: UpdateProjectRoleDto): Promise<ProjectRole> {
    const updated = await this.projectRoleModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`ProjectRole with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.projectRoleModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`ProjectRole with ID ${id} not found`);
  }
}
