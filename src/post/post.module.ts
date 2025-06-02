import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Part, PartSchema } from './schemas/part.schema';
import { Post, ProjectSchema } from './schemas/post.schema';
import { ProjectRole, ProjectRoleSchema } from './schemas/role.schema';
import { ProjectProgressUpdate, ProjectProgressUpdateSchema } from './schemas/progress.schema';
import { ProjectJoinRequest, ProjectJoinRequestSchema } from './schemas/join.schema';
import { ProjectContribution, ProjectContributionSchema } from './schemas/contribution.schema';
import { ProjectForum, ProjectForumSchema } from './schemas/forum.schema';
import { ProjectForumMessage, ProjectForumMessageSchema } from './schemas/forum.message.schema';
import { ProjectService } from './services/post.service';
import { PartService } from './services/part.service';
import { ProjectRoleService } from './services/role.service';
import { ProjectProgressUpdateService } from './services/progress.service';
import { ProjectJoinRequestService } from './services/join.service';
import { ProjectContributionService } from './services/contribution.service';
import { ProjectForumService } from './services/forum.service';
import { ProjectForumMessageService } from './services/message.service';
import { PartController } from './controllers/part.controller';
import { ProjectRoleController } from './controllers/role.controller';
import { ProjectProgressUpdateController } from './controllers/progress.controller';
import { ProjectJoinRequestController } from './controllers/join.controller';
import { ProjectContributionController } from './controllers/contribution.controller';
import { ProjectForumController } from './controllers/forum.controller';
import { ProjectForumMessageController } from './controllers/message.controller';
import { ProjectController } from './controllers/post.controller';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: ProjectSchema },
      { name: Part.name, schema: PartSchema },
      { name: ProjectRole.name, schema: ProjectRoleSchema },
      { name: ProjectProgressUpdate.name, schema: ProjectProgressUpdateSchema },
      { name: ProjectJoinRequest.name, schema: ProjectJoinRequestSchema },
      { name: ProjectContribution.name, schema: ProjectContributionSchema },
      { name: ProjectForum.name, schema: ProjectForumSchema },
      { name: ProjectForumMessage.name, schema: ProjectForumMessageSchema },
    ]),
  ],
  controllers: [
    ProjectController,
    PartController,
    ProjectRoleController,
    ProjectProgressUpdateController,
    ProjectJoinRequestController,
    ProjectContributionController,
    ProjectForumController,
    ProjectForumMessageController,
  ],
  providers: [
    ProjectService,
    PartService,
    ProjectRoleService,
    ProjectProgressUpdateService,
    ProjectJoinRequestService,
    ProjectContributionService,
    ProjectForumService,
    ProjectForumMessageService
  ],
  exports: [ProjectService],
})
export class ProjectModule {}