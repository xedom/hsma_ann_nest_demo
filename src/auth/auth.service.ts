import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from 'src/users/schemas/user.schema';
import { TokenBlacklistService } from 'src/token-blacklist/token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{
    user: { username: string; role: string; sub: string };
    access_token: string;
  }> {
    try {
      const user = await this.usersService.findOne(username);
      if (!user) throw new UnauthorizedException('User not found');
      if (!(await this.usersService.comparePasswords(pass, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        username: user.username,
        role: user.role,
        sub: user._id.toString(),
      };
      const access_token = await this.jwtService.signAsync(payload);

      return { user: payload, access_token };
    } catch (error) {
      throw error;
    }
  }

  async signUp(user: Partial<User>) {
    if (!this.usersService.validateEmail(user.email))
      throw new UnauthorizedException('Invalid email');
    if (!this.usersService.validateUsername(user.username))
      throw new UnauthorizedException('Invalid username');
    if (!this.usersService.validatePassword(user.password))
      throw new UnauthorizedException('Invalid password');

    try {
      const hashedPassword = await this.usersService.hashPassword(
        user.password,
      );

      const newUser: Omit<User, '_id'> = {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        profilePic: null,
        address: { street: '', city: '', state: '', zip: '', country: '' },
        balance: 1000,
        role: UserRole.USER,
      };

      const { username, email } =
        await this.usersService.createWithCart(newUser);

      return { username, email };
    } catch (error) {
      if (error.code === 11000)
        throw new UnauthorizedException('Username or email already exists');

      throw error;
    }
  }

  async logout(token: string) {
    const decoded = this.jwtService.decode(token);

    if (await this.tokenBlacklistService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    await this.tokenBlacklistService.blacklistToken(
      token,
      decoded['exp'] - decoded['iat'],
    );

    return { message: 'Logout successful' };
  }
}
