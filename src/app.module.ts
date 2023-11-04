import { ProductsController } from './products/products.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { ThrottlerModule } from "@nestjs/throttler";

ConfigModule.forRoot();
console.log(process.env.MONGO_URI);

@Module({
  imports: [
    UsersModule,
    CartModule,
    AuthModule,
    ProductsModule,
    ConfigModule.forRoot(), //environment variables 
    CartModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  controllers: [
    AppController
  ],
  providers: [AppService],
})
export class AppModule { }
