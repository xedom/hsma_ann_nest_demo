import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CartService } from 'src/cart/cart.service';

const publicUserFields = {
  _id: 1,
  username: 1,
  email: 1,
  profilePic: 1,
  role: 1,
  createdAt: 1,
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private cartService: CartService,
  ) {}

  async createWithCart(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    const cart = await this.cartService.create({
      userID: user._id,
      items: [],
      total: 0,
    });
    const updateUser = await this.userModel.findByIdAndUpdate(user._id, {
      cart: cart._id.toString(),
    });

    return updateUser;
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async getUser(username: string) {
    return this.userModel.find({ username }).select(publicUserFields).exec();
  }

  async getUsers() {
    return this.userModel.find().select(publicUserFields).exec();
  }

  async getProfile(id: string) {
    return this.userModel
      .findById(id)
      .select('-password -__v -createdAt -updatedAt')
      .exec();
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    // retruning all the updated fields except password
    const selectedFields = Object.keys(updateProfileDto)
      .join(' ')
      .replace(' password', '');

    return this.userModel
      .findByIdAndUpdate(id, updateProfileDto, { new: true })
      .select(selectedFields)
      .exec();
  }
}
