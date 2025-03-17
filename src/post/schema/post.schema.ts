import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId; 

  @Prop({ required: true })
  content: string; 

  @Prop({ type: [String], default: [] })
  images: string[]; 

  @Prop({ type: [String], default: [] })
  videos: string[]; 

  @Prop({ type: [String], default: [] })
  files: string[]; 

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[]; 

  @Prop({ default: 0 })
  commentsCount: number; 
}

export const PostSchema = SchemaFactory.createForClass(Post);
