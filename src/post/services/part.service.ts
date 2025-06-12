import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Part, PartDocument } from '../schemas/part.schema';
import { CreatePartDto } from '../dto/parts/create-part.dto';
import { UpdatePartDto } from '../dto/parts/update-part.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProjectService } from './post.service';

@Injectable()
export class PartService {
  constructor(
    @InjectModel(Part.name) private partModel: Model<PartDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly postService: ProjectService,
  ) {}

  async create(
    createDto: CreatePartDto,
    file?: Express.Multer.File,
  ): Promise<Part> {
    const createdPart = new this.partModel({ ...createDto });

    if (file) {
      const mimetype = file.mimetype;
      const url = await this.cloudinaryService.uploadFile(file);

      if (mimetype.startsWith('image/')) {
        createdPart.images = [url];
      } else if (mimetype.startsWith('video/')) {
        createdPart.videos = [url];
      } else if (
        mimetype === 'application/pdf' ||
        mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        createdPart.files = [url];
      } else {
        throw new Error('Unsupported file type');
      }
    }

    const savedPart = await createdPart.save();

    await this.postService.addPartToProject(createDto.project, savedPart._id as Types.ObjectId);

    return createdPart.save();
  }

  async findById(id: string): Promise<Part> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const found = await this.partModel.findById(id).exec();
    if (!found) throw new NotFoundException(`Part with ID ${id} not found`);
    return found;
  }

  async update(
    id: string,
    updateDto: UpdatePartDto,
    file?: Express.Multer.File,
  ): Promise<Part> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');

    const updated = await this.partModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) throw new NotFoundException(`Part with ID ${id} not found`);

    if (file) {
      const mimetype = file.mimetype;
      const url = await this.cloudinaryService.uploadFile(file);

      if (mimetype.startsWith('image/')) {
        updated.images = [url];
      } else if (mimetype.startsWith('video/')) {
        updated.videos = [url];
      } else if (
        mimetype === 'application/pdf' ||
        mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        updated.files = [url];
      } else {
        throw new Error('Unsupported file type');
      }

      await updated.save();
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const result = await this.partModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Part with ID ${id} not found`);
  }
}
