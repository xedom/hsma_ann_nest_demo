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
import appConfig from './config/app.config';
import { AppConfig } from './config/interfaces';

@Module({
  imports: [
    UsersModule,
    CartModule,
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    TokenBlacklistModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }), //environment variables
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
