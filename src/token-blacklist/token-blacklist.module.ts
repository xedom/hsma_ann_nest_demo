import { Module } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlacklistedToken,
  BlacklistedTokenSchema,
} from '../token-blacklist/schema/BlacklistedToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
    ]),
  ],
  providers: [TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class TokenBlacklistModule {}
