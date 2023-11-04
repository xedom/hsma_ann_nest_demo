import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/products.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOneName(name: string) {
    return this.productModel.findOne<Product>({'name': name,}).exec();
  }

  async findOneId(_id: string) {
    return this.productModel.findById(_id).exec();
  }
  
  async create(productData) {
    const product = new this.productModel(productData);
    return product.save();
  }

  async update(product_id: string, productData) {
    return this.productModel.findByIdAndUpdate(product_id, productData, { new: true }).exec();
  }

  async remove(product_id: string) {
    return this.productModel.findByIdAndRemove(product_id).exec();
  }

}
