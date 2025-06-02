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

  @Prop({ default: 'idea' })
  status: 'idea' | 'in-progress' | 'completed';

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Types.ObjectId; 

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectProgressUpdate' }], default: [] })
  progressUpdates: Types.ObjectId[]; 
}

export const PartSchema = SchemaFactory.createForClass(Part);