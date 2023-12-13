import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfig } from '../../config/interfaces';
import { JwtPayload } from '../../shared';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService<AppConfig>) {
    super({
      // available options: https://github.com/mikenicholson/passport-jwt#configure-strategy
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Users can send us the JWT token either by a bearer token in an authorization header...
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // ... or in a cookie named "jwt"
        (request: Request) => request?.cookies?.jwt,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const { username, photo } = payload;
    return { username, photo };
  }
}
