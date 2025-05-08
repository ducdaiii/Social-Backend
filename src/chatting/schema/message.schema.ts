import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chatId: Types.ObjectId;

  @Prop({ type: String, enum: ['text', 'image', 'video', 'file', 'link', 'audio', 'sticker', 'emoji'], required: true })
  type: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  seenBy: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  seenAt?: Date; 

  @Prop({ type: String, default: null })
  fileUrl?: string; 

  @Prop({ default: false })
  isDeleted: boolean; 

  @Prop({ type: Date, default: null })
  deletedAt?: Date; 
}

export const MessageSchema = SchemaFactory.createForClass(Message);