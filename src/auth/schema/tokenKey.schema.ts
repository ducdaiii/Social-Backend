import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenKeyDocument = TokenKey & Document;

@Schema()
export class TokenKey {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  publicKey: string;

  @Prop({ required: true })
  privateKey: string;

  @Prop({ required: true }) 
  refreshToken: string;
}

export const TokenKeySchema = SchemaFactory.createForClass(TokenKey);