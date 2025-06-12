import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { CreatePostDto } from '../dto/posts/create-post.dto';
import { UpdatePostDto } from '../dto/posts/update-post.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProjectForumService } from './forum.service';
import { ProjectForum, ProjectForumDocument } from '../schemas/forum.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Post.name) private projectModel: Model<PostDocument>,
    @InjectModel(ProjectForum.name)
    private forumModel: Model<ProjectForumDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly forumService: ProjectForumService,
  ) {}

  async create(
    createDto: CreatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const newPost = new this.projectModel({ ...createDto });
    const newForum = new this.forumModel({
      project: newPost._id,
      members: newPost.author,
      messages: [],
    });

    if (file) {
      const mimetype = file.mimetype;
      const url = await this.cloudinaryService.uploadFile(file);

      if (mimetype.startsWith('image/')) {
        newPost.images = [url];
      } else if (mimetype.startsWith('video/')) {
        newPost.videos = [url];
      } else if (
        mimetype === 'application/pdf' ||
        mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        newPost.files = [url];
      } else {
        throw new Error('Unsupported file type');
      }
    }

    await this.forumService.create(newForum);

    return newPost.save();
  }

  async findAllShuffle(): Promise<Post[]> {
    const posts = await this.projectModel.find().exec();
    return posts.sort(() => Math.random() - 0.5);
  }

  async findById(id: string): Promise<Post> {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('Invalid project ID');
    const project = await this.projectModel
      .findById(id)
      .populate('roles')
      .populate('parts')
      .populate('joinRequests')
      .populate('contributions')
      .populate('forum')
      .exec();
    if (!project)
      throw new NotFoundException(`Project with ID ${id} not found`);
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('Invalid project ID');

    const updated = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();

    if (!updated)
      throw new NotFoundException(`Project with ID ${id} not found`);

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
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('Invalid project ID');
    const result = await this.projectModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Project with ID ${id} not found`);
  }

  async addPartToProject(
    postId: Types.ObjectId,
    partId: Types.ObjectId,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException('Invalid Post ID');
    }

    await this.projectModel
      .findByIdAndUpdate(
        postId,
        { $addToSet: { parts: partId } },
        { new: true },
      )
      .exec();
  }

  async addMember(
    postId: Types.ObjectId,
    memberId: Types.ObjectId,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(memberId)) {
      throw new NotFoundException('Invalid Post ID');
    }

    await this.projectModel
      .findByIdAndUpdate(
        postId,
        { $addToSet: { members: memberId } },
        { new: true },
      )
      .exec();
  }

  async addRequestToProject(
    postId: Types.ObjectId,
    memberId: Types.ObjectId,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException('Invalid Post ID');
    }

    await this.projectModel
      .findByIdAndUpdate(
        postId,
        { $addToSet: { joinRequests: memberId } },
        { new: true },
      )
      .exec();
  }

  async findByAuthor(userId: string) {
    const projects = await this.projectModel
      .find({ author: userId })
      .sort({ createdAt: -1 })
      .exec();

    return { data: projects };
  }

  async findByMember(userId: string) {
    const projects = await this.projectModel
      .find({ members: userId })
      .sort({ createdAt: -1 })
      .exec();

    return { data: projects };
  }
}
