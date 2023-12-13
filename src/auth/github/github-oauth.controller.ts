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

@Controller('auth/github')
export class GithubOauthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
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
      expires: new Date(
        Date.now() + parseInt(this.configService.get('COOKIE_EXPIRES')),
      ),
      httpOnly: this.configService.get('COOKIE_HTTP_ONLY'),
      secure: this.configService.get('COOKIE_SECURE'),
      domain: this.configService.get('COOKIE_DOMAIN'),
      sameSite: this.configService.get('COOKIE_SAME_SITE'),
    });

    return {
      access_token: accessToken,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL,
    };
  }
}
