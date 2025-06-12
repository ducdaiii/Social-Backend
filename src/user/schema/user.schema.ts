import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ROLES } from 'src/common';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: false,
    default:
      'https://i.pinimg.com/736x/25/61/8b/25618bbeef90e57e23a61bacb89582f4.jpg',
  })
  avatar: string;

  @Prop({
    required: false,
    default:
      'https://i.pinimg.com/736x/df/bd/84/dfbd8419494737ad5b129de7dec212f5.jpg',
  })
  background: string;

  @Prop({ required: true, default: false })
  verify: boolean;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ required: false })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, enum: ROLES, default: ROLES.User })
  role: ROLES;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  followers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  following: Types.ObjectId[];

  @Prop({ required: false })
  nickname: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  bio: string;

  @Prop({ type: String, enum: ['male', 'female', 'other'], required: false })
  gender: 'male' | 'female' | 'other';

  @Prop({ type: Date, required: false })
  birthDate: Date;

  @Prop({ required: false })
  location: string;

  @Prop({ type: [String], required: false })
  socialLinks: string[];

  @Prop({ required: false, default: false })
  isBanned: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectJoinRequest' }], default: [] })
  projectSend: Types.ObjectId[];

  @Prop({ type: Date, required: false })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);