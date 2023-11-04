import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    { userId: 1, username: 'admin', password: 'admin', email: 'admin@shop.de' },
    { userId: 2, username: 'pingu', password: 'pingu', email: 'pingu@shop.de' },
  ];

  create(createUserDto: CreateUserDto) {
    return `This action adds a new user: ${JSON.stringify(createUserDto)}`;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // eslint-disable-next-line prettier/prettier
    return `This action updates a #${id} user: ${JSON.stringify(updateUserDto)}`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
