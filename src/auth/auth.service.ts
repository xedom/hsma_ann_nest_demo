import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.username };
    const access_token = await this.jwtService.signAsync(payload);

    return { user: payload, access_token };
  }

  async signUp(user: Record<string, any>): Promise<any> {
    const newUser = await this.usersService.create({
      username: user.username,
      email: user.email,
      password: user.password,
      profilePic: '',
      balance: 0,
      role: UserRole.VUser,
    });

    console.log(newUser);
  }
}
