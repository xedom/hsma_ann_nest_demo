import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/*userID: String,
  items: [{
    productID: String,
    quantity: Number,
  }],
  total: Number,
}*/

@Schema()
export class Cart {
  @Prop({ required: true, unique: true })
  userID: string;

  @Prop({type:[{productID:{type:String}, quantity:{type:Number}}]})
  items: { productID: string; quantity: number }[];
  
  @Prop({ required: true })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
