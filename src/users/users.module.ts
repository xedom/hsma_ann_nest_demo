import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from 'src/cart/cart.module';
import { TokenBlacklistModule } from 'src/token-blacklist/token-blacklist.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CartModule,
    TokenBlacklistModule,
    HttpModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
