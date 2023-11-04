import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private readonly users = [
    { userId: 1, username: 'admin', password: 'admin', email: 'admin@shop.de' },
    { userId: 2, username: 'pingu', password: 'pingu', email: 'pingu@shop.de' },
  ];

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userModel.create(createUserDto);
    return newUser;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<User | undefined> {
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
