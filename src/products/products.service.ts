import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/products.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOneName(name: string) {
    return this.productModel.findOne<Product>({ name: name }).exec();
  }

  async findOneId(_id: string) {
    return this.productModel.findById(_id).exec();
  }

  async findByUser(userID: string) {
    console.log('userID', userID);
    return this.productModel
      .find({ userID: new Types.ObjectId(userID) })
      .exec();
  }

  async create(productData: Product) {
    const product = new this.productModel(productData);
    return product.save();
  }

  async update(product_id: string, productData) {
    return this.productModel
      .findByIdAndUpdate(product_id, productData, { new: true })
      .exec();
  }

  async getProductsCost(
    products: { productID: Types.ObjectId; quantity: number }[],
  ) {
    let cost = 0;

    // TODO optimize query
    for (const product of products) {
      const productData = await this.productModel
        .findById(product.productID)
        .exec();
      cost += productData.price * product.quantity;
    }

    return cost;
  }

  async remove(product_id: string) {
    return this.productModel.findByIdAndRemove(product_id).exec();
  }

  async removeAsUser(userID: string, product_id: string) {
    return this.productModel
      .findOneAndRemove({ userID: new Types.ObjectId(userID), _id: product_id })
      .exec();
  }
}
