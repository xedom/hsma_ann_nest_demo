import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload, User } from '../../shared';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User) {
    const { id, username, photos } = user;
    const payload: JwtPayload = {
      sub: id,
      username,
      role: user.role,
      photo: photos?.[0],
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
