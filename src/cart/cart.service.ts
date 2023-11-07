import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ItemDto } from './dto/item.dto copy';
import { OrdersService } from 'src/orders/orders.service';
import { Order, OrderStatus } from 'src/orders/schemas/order.schema';

@Injectable()
export class CartService {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  async create(cart: Cart) {
    return this.cartModel.create(cart);
  }

  async findAll() {
    return this.cartModel.find().exec();
  }

  //gibt Cart des eingeloggten Users zurueck
  async findOne(userID: string): Promise<Cart | undefined> {
    const cart = await this.cartModel
      .findOne({ userID: new Types.ObjectId(userID) })
      .exec();
    return cart;
  }

  async addItems(userID: string, itemDto: ItemDto[]) {
    const items = itemDto.map((item) => ({
      ...item,
      productID: new Types.ObjectId(item.productID),
    }));

    return this.cartModel.updateOne(
      { userID: new Types.ObjectId(userID) },
      { $push: { items: { $each: items } } },
    );
  }

  async updateCartItem(
    userID: string,
    itemID: string,
    updateCartDto: UpdateCartDto,
  ) {
    return this.cartModel.updateOne(
      { userID: new Types.ObjectId(userID), 'items._id': itemID },
      { $set: { 'items.$.quantity': updateCartDto.quantity } },
    );
  }

  async deleteCartItem(userID: string, itemID: string) {
    return this.cartModel.updateOne(
      { userID: new Types.ObjectId(userID) },
      { $pull: { items: { _id: itemID } } },
    );
  }

  async checkout(userID: string) {
    const cart = await this.findOne(userID);
    if (cart) return null;

    const newOrder: Order = {
      userID: new Types.ObjectId(userID),
      items: cart.items,
      total: cart.total,
      status: OrderStatus.PENDING,
    };
    const order = await this.ordersService.create(newOrder);

    await this.cartModel.updateOne(
      { userID: new Types.ObjectId(userID) },
      { items: [], total: 0 },
    );

    // // creating a new cart
    // const newCart: Cart = {
    //   userID: new Types.ObjectId(userID),
    //   items: [],
    //   total: 0,
    // };
    // await this.create(newCart);

    return order;
  }
}
