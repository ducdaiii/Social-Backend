import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schema/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: Role): Promise<Role> {
    const role = new this.roleModel(createRoleDto);
    return role.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findOne(id: string): Promise<Role> {
    return this.roleModel.findById(id).exec();
  }

  async update(id: string, updateRoleDto: Role): Promise<Role> {
    return this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Role> {
    return this.roleModel.findByIdAndDelete(id).exec();
  }
}