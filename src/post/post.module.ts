import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Part, PartSchema } from './schemas/part.schema';
import { Post, ProjectSchema } from './schemas/post.schema';
import { ProjectProgressUpdate, ProjectProgressUpdateSchema } from './schemas/progress.schema';
import { ProjectJoinRequest, ProjectJoinRequestSchema } from './schemas/join.schema';
import { ProjectContribution, ProjectContributionSchema } from './schemas/contribution.schema';
import { ProjectForum, ProjectForumSchema } from './schemas/forum.schema';
import { ProjectForumMessage, ProjectForumMessageSchema } from './schemas/forum.message.schema';
import { ProjectService } from './services/post.service';
import { PartService } from './services/part.service';
import { ProjectProgressUpdateService } from './services/progress.service';
import { ProjectJoinRequestService } from './services/join.service';
import { ProjectContributionService } from './services/contribution.service';
import { ProjectForumService } from './services/forum.service';
import { ProjectForumMessageService } from './services/message.service';
import { PartController } from './controllers/part.controller';
import { ProjectProgressUpdateController } from './controllers/progress.controller';
import { ProjectJoinRequestController } from './controllers/join.controller';
import { ProjectContributionController } from './controllers/contribution.controller';
import { ProjectForumController } from './controllers/forum.controller';
import { ProjectForumMessageController } from './controllers/message.controller';
import { ProjectController } from './controllers/post.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: ProjectSchema },
      { name: Part.name, schema: PartSchema },
      { name: ProjectProgressUpdate.name, schema: ProjectProgressUpdateSchema },
      { name: ProjectJoinRequest.name, schema: ProjectJoinRequestSchema },
      { name: ProjectContribution.name, schema: ProjectContributionSchema },
      { name: ProjectForum.name, schema: ProjectForumSchema },
      { name: ProjectForumMessage.name, schema: ProjectForumMessageSchema },
    ]),
    CloudinaryModule, 
    UserModule
  ],
  controllers: [
    ProjectController,
    PartController,
    ProjectProgressUpdateController,
    ProjectJoinRequestController,
    ProjectContributionController,
    ProjectForumController,
    ProjectForumMessageController,
  ],
  providers: [
    ProjectService,
    PartService,
    ProjectProgressUpdateService,
    ProjectJoinRequestService,
    ProjectContributionService,
    ProjectForumService,
    ProjectForumMessageService
  ],
  exports: [ProjectService],
})
export class ProjectModule {}