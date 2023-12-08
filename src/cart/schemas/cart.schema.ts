import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Item, ItemSchema } from './item.schema';

/*userID: String,
  items: [{
    productID: String,
    quantity: Number,
  }],
  total: Number,
}*/

@Schema()
export class Cart {
  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: 'User' })
  userID: Types.ObjectId;

  @Prop({ type: [ItemSchema], default: [] })
  items?: Item[];

  @Prop({ required: true, default: 0 })
  total?: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
