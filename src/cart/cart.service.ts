import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ItemDto } from './dto/item.dto copy';
import { OrdersService } from 'src/orders/orders.service';
import { Order, OrderStatus } from 'src/orders/schemas/order.schema';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
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
    if (itemDto.length == 0) return { statusCode: 400, message: 'Bad request' };
    if (itemDto.filter((item) => item.quantity < 1).length > 0) {
      return { statusCode: 400, message: 'Bad request' };
    }
    if (
      itemDto.filter(
        (item) => item.productID == null || item.productID == undefined,
      ).length > 0
    ) {
      return { statusCode: 400, message: 'Bad request' };
    }

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
    if (!cart) return { statusCode: 404, message: 'Cart not found' };

    const orderCost = await this.productsService.getProductsCost(cart.items);

    const order = await this.ordersService.create({
      userID: new Types.ObjectId(userID),
      items: cart.items,
      total: orderCost,
      date: new Date(),
      status: OrderStatus.PENDING,
    } as Order);

    await this.cartModel.updateOne(
      { userID: new Types.ObjectId(userID) },
      { items: [], total: 0 },
    );

    // creating a new cart
    // await this.create({
    //   userID: new Types.ObjectId(userID),
    //   items: [],
    //   total: 0,
    // } as Cart);

    return order;
  }

  async clear(userID: string) {
    const cart = await this.findOne(userID);
    if (!cart) return { statusCode: 404, message: 'Cart not found' };

    const res = await this.cartModel.updateOne(
      { userID: new Types.ObjectId(userID) },
      { items: [], total: 0 },
    );

    return res;
  }
}
