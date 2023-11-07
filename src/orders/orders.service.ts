import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(order: Order) {
    return this.orderModel.create(order);
  }

  async getOrders(userID: string) {
    return this.orderModel.find({ userID: new Types.ObjectId(userID) }).exec();
  }

  async getOrder(userID: string, id: string) {
    return this.orderModel
      .findOne({
        _id: new Types.ObjectId(id),
        userID: new Types.ObjectId(userID),
      })
      .exec();
  }

  async cancelOrder(userID: string, id: string) {
    return this.orderModel.updateOne(
      { _id: new Types.ObjectId(id), userID: new Types.ObjectId(userID) },
      { status: OrderStatus.CANCELED },
    );
  }

  async returnOrder(userID: string, id: string) {
    return this.orderModel.updateOne(
      { _id: new Types.ObjectId(id), userID: new Types.ObjectId(userID) },
      { status: OrderStatus.RETURNED },
    );
  }
}
