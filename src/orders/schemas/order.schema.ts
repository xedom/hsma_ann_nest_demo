import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Item, ItemSchema } from 'src/cart/schemas/item.schema';

export enum OrderStatus {
  DONE = 'Done',
  PENDING = 'Pending',
  CANCELED = 'Canceled',
  RETURNED = 'Returned',
}

@Schema()
export class Order {
  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: 'User' })
  userID: Types.ObjectId;

  @Prop({ type: [ItemSchema], default: [] })
  items: Item[];

  @Prop({ required: true })
  total: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.DONE })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
