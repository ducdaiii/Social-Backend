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
  role: string;

  @Prop({ default: 'Pending' })
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const ProjectJoinRequestSchema = SchemaFactory.createForClass(ProjectJoinRequest);