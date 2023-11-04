import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';

ConfigModule.forRoot();
console.log(process.env.MONGO_URI);

@Module({
  imports: [
    UsersModule,
    CartModule,
    AuthModule,
    ConfigModule.forRoot(), //environment variables
    MongooseModule.forRoot(process.env.MONGO_URI), CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
