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

  @Prop({ required: true, default: false })
  verify: boolean;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ required: false})
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: false })
  walletAddress?: string;

  @Prop({ type: String, enum: ROLES, default: ROLES.Member })
  role: ROLES;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  followers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  following: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
