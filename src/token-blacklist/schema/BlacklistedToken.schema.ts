import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BlacklistedToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expires: Date;
}

export const BlacklistedTokenSchema =
  SchemaFactory.createForClass(BlacklistedToken);
