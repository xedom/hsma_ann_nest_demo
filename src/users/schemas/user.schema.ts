import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  VENDOR = 'vendor',
  USER = 'user',
}

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ default: null })
  email?: string;

  @Prop({ default: null })
  password?: string;

  @Prop({ default: null })
  provider?: string;

  @Prop({ default: null })
  providerID?: string;

  @Prop({ default: null })
  picture?: string | null; // TODO: change to buffer and save image type

  @Prop({ default: null }) // @Prop({ type: AddressSchema })
  address?: string; // address: Address;

  @Prop({ default: 0 })
  balance?: number;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role?: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
