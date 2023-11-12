import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/users/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { BlacklistedToken } from './schema/BlacklistedToken.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(BlacklistedToken.name)
    private readonly blacklistedTokenModel: Model<BlacklistedToken>,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = {
      username: user.username,
      role: user.role,
      sub: user._id.toString(),
    };
    const access_token = await this.jwtService.signAsync(payload);

    return { user: payload, access_token };
  }

  async signUp(user: Partial<User>): Promise<any> {
    const newUser: Omit<User, '_id'> = {
      username: user.username,
      email: user.email,
      password: user.password,
      profilePic: null,
      address: { street: '', city: '', state: '', zip: '', country: '' },
      orders: [] as Types.Array<Types.ObjectId>,
      cart: null,
      balance: 0,
      role: UserRole.USER,
    };

    const { username, email } = await this.usersService.createWithCart(newUser);

    return { username, email };
  }

  async logout(token: string): Promise<any> {
    const decoded = await this.jwtService.decode(token);
    if (!this.isTokenBlacklisted(token)) throw new UnauthorizedException();

    const blacklistedToken = new this.blacklistedTokenModel({
      token,
      expires: new Date(decoded['exp'] * 1000),
    });
    await blacklistedToken.save();
    return 'Logged out successfully';
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    // Search for the token in your storage to see if it's been blacklisted
    const tokenFound = await this.blacklistedTokenModel
      .findOne({ token })
      .exec();

    console.log('tokenFound', tokenFound);
    if (tokenFound) {
      // Check if the current date is before the token's expiration date
      if (new Date() < tokenFound.expires) {
        return true; // Token is blacklisted and still valid (not expired)
      }
      // If the token is expired, it can be safely removed from the blacklist
      await this.blacklistedTokenModel.deleteOne({ token }).exec();
    }
    return false; // Token is not blacklisted or it has expired
  }
}
