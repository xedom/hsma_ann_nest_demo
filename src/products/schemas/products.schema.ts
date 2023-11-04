import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product {

  @Prop({ required: true, unique: true })
  name: String;

  @Prop({ required: true})
  description: String;

  @Prop({ required: true})
  price: Number;

  @Prop({ required: true})
  stock: Number;

  @Prop()
  images: [String];

  @Prop()
  category: String;

  @Prop()
  reviews: [{
    userID: String,
    rating: Number,
    comment: String,
  }];

}

export const ProductSchema = SchemaFactory.createForClass(Product);
