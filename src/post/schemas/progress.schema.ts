import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ProjectProgressUpdateDocument = ProjectProgressUpdate & Document;

@Schema({ timestamps: true })
export class ProjectProgressUpdate {
  @Prop({ required: true })
  content: string; 

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Part' })
  part: Types.ObjectId;
}

export const ProjectProgressUpdateSchema = SchemaFactory.createForClass(ProjectProgressUpdate);