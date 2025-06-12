import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenKeyDocument = TokenKey & Document;

@Schema()
export class TokenKey {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: false })
  publicKey: string;

  @Prop({ required: false })
  privateKey: string;

  @Prop({ required: true }) 
  refreshToken: string;

  @Prop({ required: false }) 
  githubAccessToken: string;
}

export const TokenKeySchema = SchemaFactory.createForClass(TokenKey);