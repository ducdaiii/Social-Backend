import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProjectJoinRequest,
  ProjectJoinRequestDocument,
} from '../schemas/join.schema';
import { CreateProjectJoinRequestDto } from '../dto/joins/create-project-join-request.dto';
import { UpdateProjectJoinRequestDto } from '../dto/joins/update-project-join-request.dto';
import { ProjectService } from './post.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProjectJoinRequestService {
  constructor(
    @InjectModel(ProjectJoinRequest.name)
    private joinRequestModel: Model<ProjectJoinRequestDocument>,
    private readonly postService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async create(
    createDto: CreateProjectJoinRequestDto,
  ): Promise<ProjectJoinRequest> {
    const created = new this.joinRequestModel({
      user: new Types.ObjectId(createDto.user),
      project: new Types.ObjectId(createDto.project),
      role: createDto.role,
    });

    const saveRequest = await created.save();

    await this.postService.addRequestToProject(
      created.project,
      saveRequest._id as Types.ObjectId,
    );

    await this.userService.addProjectToUser(saveRequest._id as Types.ObjectId, created.user);

    return saveRequest;
  }

  async findById(id: string): Promise<ProjectJoinRequest> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid ID');
    }

    const found = await this.joinRequestModel
      .findOne({ _id: id })
      .populate('user', '-password -__v')
      .exec();

    return found;
  }

  async approveJoinRequest(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');

    const approve = await this.joinRequestModel
      .findByIdAndUpdate(id, { status: 'Approved' }, { new: true })
      .exec();

    await this.postService.addMember(approve.project, approve.user);

    if (!approve)
      throw new NotFoundException(`Request with ID ${id} not found`);
  }

  async rejectJoinRequest(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');

    const updated = await this.joinRequestModel
      .findByIdAndUpdate(id, { status: 'Rejected' }, { new: true })
      .exec();

    if (!updated)
      throw new NotFoundException(`Request with ID ${id} not found`);
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('Invalid ProjectJoinRequest');
    const result = await this.joinRequestModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new NotFoundException(`ProjectJoinRequest with ID ${id} not found`);
  }
}
