import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type PartDocument = Part & Document;

@Schema({ timestamps: true })
export class Part {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({ type: [String], default: [] })
  files: string[];

  @Prop({ default: 'Idea' })
  status: 'Idea' | 'In-progress' | 'Completed';

  @Prop({ required: true })
  author: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  project: Types.ObjectId; 

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectProgressUpdate' }], default: [] })
  progressUpdates: Types.ObjectId[]; 
}

export const PartSchema = SchemaFactory.createForClass(Part);