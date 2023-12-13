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

  async createWithCart(dto: User) {
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

  async findOrCreateGithub(userData: Partial<User>) {
    console.log('-- userData:', userData);

    const user = await this.userModel
      .findOne({ githubID: userData.githubID })
      .exec();
    if (user) return user;

    const newUser = await this.userModel.create({
      ...userData,
      password: 'xxxx',
    }); // TODO
    return newUser;
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

  async getUsers() {
    return this.userModel.find().select(publicUserFields).exec();
  }

  async getProfile(id: string) {
    return this.userModel
      .findById(id)
      .select('-password -__v -createdAt -updatedAt')
      .exec();
  }

  async updateProfile(userID: string, updateProfileDto: UpdateProfileDto) {
    // retruning all the updated fields except password
    const toUpdate: Record<string, string> = Object.entries(updateProfileDto)
      .filter((entry) => entry[1] !== '' && entry[1] !== undefined)
      .reduce((acc, [key, value]) => {
        if (key === 'email' && !this.validateEmail(value))
          throw new HttpException('Invalid email', 400);
        if (key === 'username' && !this.validateUsername(value))
          throw new HttpException('Invalid username', 400);
        if (key === 'newPassword' && !this.validatePassword(value))
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

    console.log('-- toUpdate:', toUpdate);
    console.log('-- fieldsToReturn:', fieldsToReturn);

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
    return email.includes('@');
  }

  validateUsername(username: string): boolean {
    return username.replaceAll(' ', '').length > 3;
  }

  validatePassword(password: string): boolean {
    return password.length > 2;
  }
}
