import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { OrdersModule } from './orders/orders.module';
import { TokenBlacklistModule } from './token-blacklist/token-blacklist.module';

ConfigModule.forRoot();

@Module({
  imports: [
    UsersModule,
    CartModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    TokenBlacklistModule,
    ConfigModule.forRoot(), //environment variables
    MongooseModule.forRoot(process.env.MONGO_URI),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
