import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistedToken } from './schema/BlacklistedToken.schema';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectModel(BlacklistedToken.name)
    private readonly blacklistedTokenModel: Model<BlacklistedToken>,
  ) {}

  async blacklistToken(token: string, expire: number): Promise<void> {
    const blacklistedToken = new this.blacklistedTokenModel({
      token,
      expires: new Date(expire * 1000),
    });
    await blacklistedToken.save();
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenFound = await this.blacklistedTokenModel
      .findOne({ token })
      .exec();

    if (!tokenFound) return false; // Token is not blacklisted, also valid

    if (new Date() < tokenFound.expires) return true; // Token is blacklisted and still valid (not expired)

    await this.blacklistedTokenModel.deleteOne({ token }).exec();

    return false; // Token is blacklisted and expired
  }
}
