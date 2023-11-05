import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userModel.create(createUserDto);
    return newUser;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ username: username }).exec();
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // eslint-disable-next-line prettier/prettier
    return `This action updates a #${id} user: ${JSON.stringify(
      updateUserDto,
    )}`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
