import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { OrdersModule } from 'src/orders/orders.module';
import { TokenBlacklistModule } from 'src/token-blacklist/token-blacklist.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    TokenBlacklistModule,
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
