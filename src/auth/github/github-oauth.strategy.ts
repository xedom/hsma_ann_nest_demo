import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

import { AppConfig } from '../../config/interfaces';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService<AppConfig>,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('auth.github.clientId'),
      clientSecret: configService.get<string>('auth.github.clientSecret'),
      callbackURL: configService.get<string>('auth.github.callbackURL'),
      scope: ['public_profile user:email'],
    });
  }

  async validate(accessToken, refreshToken, profile) {
    console.log('---profile:', profile);
    const user = await this.usersService.findOrCreateByProvider({
      provider: 'github',
      providerID: profile.id.toString(),
      username: profile.username,
      email: profile._json.email,
      picture: profile._json.avatar_url,
    });

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
