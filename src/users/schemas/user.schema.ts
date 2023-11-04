import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  Admin = 'admin',
  VUser = 'vuser',
  CUser = 'cuser',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profilePic: string;

  // @Prop()
  // address: {
  //   street: string;
  //   city: string;
  //   state: string;
  //   zip: string;
  //   country: string;
  // };
  // orders: [OrderID];
  // cart: CartID;

  @Prop()
  balance: number;

  @Prop()
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
