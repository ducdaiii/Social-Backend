import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ProjectForumMessageDocument = ProjectForumMessage & Document;

@Schema({ timestamps: true })
export class ProjectForumMessage {
  @Prop({ type: Types.ObjectId, ref: 'ProjectForum', required: true })
  forum: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  content: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectForumMessage' }], default: [] })
  replies: Types.ObjectId[]; 

  @Prop({ default: false })
  edited: boolean; 

  @Prop({ default: false })
  deleted: boolean; 
}

export const ProjectForumMessageSchema = SchemaFactory.createForClass(ProjectForumMessage);
