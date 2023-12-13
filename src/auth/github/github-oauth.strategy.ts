import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

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
      scope: ['public_profile'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const { id } = profile;
    console.log('-- profile:', profile);
    const user = await this.usersService.findOrCreateGithub({
      githubID: id,
      username: profile.username,
      email: profile._json.email || `${profile.username}@github.com`,
      provider: profile.provider,
      profilePic: profile._json.avatar_url,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
