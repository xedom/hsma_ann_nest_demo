import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { User } from '../../shared';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { Auth0Guard } from './auth0.guard';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/interfaces';

@Controller('auth/auth0')
export class Auth0Controller {
  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService<AppConfig>,
  ) {}

  @Get()
  @UseGuards(Auth0Guard)
  async auth0Auth() {}

  @Get('callback')
  @Redirect()
  @UseGuards(Auth0Guard)
  async auth0Callback(
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
