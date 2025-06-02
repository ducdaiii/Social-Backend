import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ProjectForumDocument = ProjectForum & Document;

@Schema({ timestamps: true })
export class ProjectForum {
  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  members: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectForumMessage' }], default: [] })
  messages: Types.ObjectId[];
}

export const ProjectForumSchema = SchemaFactory.createForClass(ProjectForum);