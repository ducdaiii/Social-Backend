import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Part, PartDocument } from '../schemas/part.schema';
import { CreatePartDto } from '../dto/parts/create-part.dto';
import { UpdatePartDto } from '../dto/parts/update-part.dto';

@Injectable()
export class PartService {
  constructor(
    @InjectModel(Part.name) private partModel: Model<PartDocument>,
  ) {}

  async create(createDto: CreatePartDto): Promise<Part> {
    const created = new this.partModel(createDto);
    return created.save();
  }

  async findAll(): Promise<Part[]> {
    return this.partModel.find().exec();
  }

  async findById(id: string): Promise<Part> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const found = await this.partModel.findById(id).exec();
    if (!found) throw new NotFoundException(`Part with ID ${id} not found`);
    return found;
  }

  async update(id: string, updateDto: UpdatePartDto): Promise<Part> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const updated = await this.partModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Part with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const result = await this.partModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Part with ID ${id} not found`);
  }
}