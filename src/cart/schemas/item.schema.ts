import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Item {
  @Prop({ required: true }) // TODO: change to @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productID: string; // TODO: change to ObjectId

  @Prop({ required: true, default: 1 })
  quantity: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
