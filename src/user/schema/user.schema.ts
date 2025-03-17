import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from 'src/common';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) 
export class User {
  @Prop({ required: false, default: 'https://i.pinimg.com/736x/25/61/8b/25618bbeef90e57e23a61bacb89582f4.jpg' })
  avatar: string;

  @Prop({ required: true, default: false }) 
  verify: boolean;

  @Prop({ required: true, default: true }) 
  active: boolean;

  @Prop({ required: false, unique: true }) 
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: true })
  walletAddress: string;

  @Prop({ type: String, enum: ROLES, default: ROLES.Member })
  role: ROLES;
}

export const UserSchema = SchemaFactory.createForClass(User);