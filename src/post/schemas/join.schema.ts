import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ProjectJoinRequestDocument = ProjectJoinRequest & Document;

@Schema({ timestamps: true })
export class ProjectJoinRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ required: true })
  profile: string; 

  @Prop({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Prop({ type: String, default: '' })
  note?: string; 
}

export const ProjectJoinRequestSchema = SchemaFactory.createForClass(ProjectJoinRequest);