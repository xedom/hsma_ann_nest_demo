import {
  Controller,
  Get,
  Req,
  Res,
  Redirect,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { User } from '../../shared';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { GithubOauthGuard } from './github-oauth.guard';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/interfaces';

@Controller('auth/github')
export class GithubOauthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService<AppConfig>,
  ) {}

  @Get()
  @UseGuards(GithubOauthGuard)
  async githubAuth() {}

  @Get('callback')
  @Redirect()
  @UseGuards(GithubOauthGuard)
  async githubAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as User;
    const { accessToken } = this.jwtAuthService.login(user);

    res.cookie('user_jwt', accessToken, {
      ...this.configService.get('cookie'),
      expires: new Date(
        Date.now() + parseInt(this.configService.get<string>('cookie.expires')),
      ),
    });

    return {
      access_token: accessToken,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL,
    };
  }
}
