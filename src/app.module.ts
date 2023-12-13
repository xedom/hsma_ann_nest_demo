import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { OrdersModule } from './orders/orders.module';
import { TokenBlacklistModule } from './token-blacklist/token-blacklist.module';
import { GithubOauthModule } from './auth/github/github-oauth.module';
import appConfig from './config/app.config';
import { AppConfig } from './config/interfaces';

ConfigModule.forRoot();

const configService: ConfigService<AppConfig> = new ConfigService();

@Module({
  imports: [
    UsersModule,
    CartModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    TokenBlacklistModule,
    GithubOauthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }), //environment variables
    // MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forRoot(configService.get<string>('mongodb.uri')),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
