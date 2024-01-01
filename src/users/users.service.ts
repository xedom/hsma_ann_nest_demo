import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CartService } from 'src/cart/cart.service';
import * as bcrypt from 'bcrypt';

const publicUserFields = {
  _id: 1,
  username: 1,
  email: 1,
  picture: 1,
  role: 1,
  createdAt: 1,
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private cartService: CartService,
  ) {}

  async createWithCart(dto: Partial<User>) {
    const user = await this.userModel.create({ balance: 1000, ...dto });
    await this.cartService.create({ userID: user._id });

    return user;
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(username: string) {
    return this.userModel.findOne({ username: username }).exec();
  }

  async findOrCreateByProvider(userData: Partial<User>) {
    console.log('-- userData:', userData);

    const user = await this.userModel
      .findOne({ provider: userData.provider, providerID: userData.providerID })
      .exec();

    console.log('-- user:', user);

    if (user) return user;

    return this.createWithCart(userData);
  }

  async findOneWithPassword(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).exec();
    const passHash = this.comparePasswords(password, user.password);
    if (!passHash) throw new HttpException('Invalid password', 400);
    return user;
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async getUser(username: string) {
    return this.userModel.find({ username }).select(publicUserFields).exec();
  }

  async getUserByID(userID: string) {
    return this.userModel.findById(userID).select(publicUserFields).exec();
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

  async update(id: string, updateUserDto: { role: string }) {
    const res = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .exec();

    return res;
  }

  async updateProfile(userID: string, updateProfileDto: UpdateProfileDto) {
    // retruning all the updated fields except password
    const toUpdate: Record<string, string> = Object.entries(updateProfileDto)
      .filter((entry) => entry[1] !== '' && entry[1] !== undefined)
      .reduce((acc, [key, value]) => {
        if (key === 'email' && !this.validateEmail(value as string))
          throw new HttpException('Invalid email', 400);
        if (key === 'username' && !this.validateUsername(value as string))
          throw new HttpException('Invalid username', 400);
        if (key === 'newPassword' && !this.validatePassword(value as string))
          throw new HttpException('Invalid password', 400);

        // if (key === 'password') value = this.hashPasswordSync(value);
        // if (key === 'newPassword') value = this.hashPasswordSync(value);

        acc[key] = value;
        return acc;
      }, {});

    if (Object.keys(toUpdate).length === 0)
      return { message: 'Nothing to update' };

    const toUpdateKeys = Object.keys(toUpdate);

    if (toUpdateKeys.includes('newPassword')) {
      if (!toUpdateKeys.includes('password'))
        throw new HttpException('Missing password', 400);

      const { password, newPassword } = toUpdate;
      const userToUpdate = await this.userModel.findById(userID).exec();
      const isMatch = await this.comparePasswords(
        password,
        userToUpdate.password,
      );

      if (!isMatch) throw new HttpException('Invalid password', 400);
      toUpdate.password = await this.hashPassword(newPassword);
      delete toUpdate.newPassword;
    }

    const fieldsToReturn = toUpdateKeys.join(' ').replace(' password', '');

    return this.userModel
      .findByIdAndUpdate(userID, toUpdate)
      .select(fieldsToReturn)
      .exec();
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10); // TODO replace with env var
    console.log('-- salt --', salt);
    return bcrypt.hash(password, 10); // TODO replace rounds with salt
  }

  hashPasswordSync(password: string) {
    const salt = bcrypt.genSaltSync(10); // TODO replace with env var
    console.log('-- salt --', salt);
    return bcrypt.hashSync(password, 10); // TODO replace rounds with salt
  }

  async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  validateUsername(username: string): boolean {
    const usernameMinLength = 3;
    // const usernameRegex = /^[a-zA-Z]+(?:[_-][a-zA-Z0-9]+)*$/;
    const usernameRegex = /^[a-zA-Z0-9-_]{3,}$/;
    return username.length >= usernameMinLength && usernameRegex.test(username);
  }

  validatePassword(password: string): boolean {
    const passwordMinLength = 6;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    const passwordRegex = /^.{6,}$/;
    return password.length >= passwordMinLength && passwordRegex.test(password);
  }
}
