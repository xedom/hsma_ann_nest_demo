import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address, AddressSchema } from './address.schema';
import { Document, Types } from 'mongoose';

// import { Order } from './order.schema';
// import { Cart } from './cart.schema';

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

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profilePic: string; // TODO: change to buffer and save image type

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }] })
  orders: Types.Array<Types.ObjectId>;

  @Prop({ type: Types.ObjectId, ref: 'Cart' })
  cart: Types.ObjectId;

  @Prop()
  balance: number;

  @Prop({ type: String, enum: UserRole })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
