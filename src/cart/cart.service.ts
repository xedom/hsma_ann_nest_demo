import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ItemDto } from './dto/item.dto copy';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  
  async create(createCartDto: CreateCartDto) {
      this.cartModel.create(createCartDto);
  
      return `This action creates a new cart-item: ${JSON.stringify(createCartDto)}`;
  }
  
    remove(id: string) {
      return `This action removes a item from user cart`;
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

  async update(id: string, updateCartDto: UpdateCartDto) {
    // eslint-disable-next-line prettier/prettier
    return `This action updates a #${id} user: ${JSON.stringify(
      updateCartDto,
    )}`;
  }

  async addItems(userID: string, itemDto: ItemDto[]) {
    console.log('updating', userID, itemDto);
    return this.cartModel.updateOne(
      { userID: new Types.ObjectId(userID) },
      { $push: { items: { $each: itemDto } } },
    );
  }
}
