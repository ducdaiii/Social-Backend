import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectRoleDocument = ProjectRole & Document;

@Schema()
export class ProjectRole {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;
}

export const ProjectRoleSchema = SchemaFactory.createForClass(ProjectRole);