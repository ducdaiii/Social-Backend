import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members: Types.ObjectId[];

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({ type: [String], default: [] })
  files: string[];

  @Prop({ default: 'idea' })
  status: 'idea' | 'in-progress' | 'completed';

  @Prop({ default: 'remote' })
  workingMode: 'remote' | 'onsite' | 'hybrid';

  @Prop({ type: String, default: '' })
  location?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectRole' }], default: [] })
  roles: Types.ObjectId[]; 

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Part' }], default: [] })
  parts: Types.ObjectId[]; 

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectJoinRequest' }], default: [] })
  joinRequests: Types.ObjectId[]; 

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectContribution' }], default: [] })
  contributions: Types.ObjectId[]; 

  @Prop({ type: Types.ObjectId, ref: 'ProjectForum' })
  forum: Types.ObjectId; 
}

export const ProjectSchema = SchemaFactory.createForClass(Post);