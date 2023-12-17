import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Product {
  @Prop({ default: null, type: Types.ObjectId, ref: 'User' })
  userID: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop()
  images: [string];

  @Prop()
  category: string;

  @Prop()
  reviews: [{ userID: string; rating: number; comment: string }];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
