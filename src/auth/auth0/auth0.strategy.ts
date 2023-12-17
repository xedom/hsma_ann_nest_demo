import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { AppConfig } from '../../config/interfaces';
import { UsersService } from '../../users/users.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    private configService: ConfigService<AppConfig>,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('auth.auth0.clientId'),
      clientSecret: configService.get<string>('auth.auth0.clientSecret'),
      callbackURL: configService.get<string>('auth.auth0.callbackURL'),
      domain: 'hsma.eu.auth0.com',
      state: false,
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken, refreshToken, profile) {
    const user = await this.usersService.findOrCreateByProvider({
      provider: profile.provider,
      providerID: profile.id.split('|')[1],
      username: profile.nickname,
      email: profile.emails ? profile.emails[0].value : null,
      picture: profile.picture,
    });

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
