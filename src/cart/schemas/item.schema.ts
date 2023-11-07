import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Item {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productID: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  quantity: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
