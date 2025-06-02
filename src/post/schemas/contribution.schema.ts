import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ProjectContributionDocument = ProjectContribution & Document;

@Schema({ timestamps: true })
export class ProjectContribution {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Types.ObjectId;

  @Prop({ required: true })
  type: string; 

  @Prop({ required: true })
  content: string; 

  @Prop({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';
}

export const ProjectContributionSchema = SchemaFactory.createForClass(ProjectContribution);