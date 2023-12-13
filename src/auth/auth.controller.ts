import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Redirect,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthGuard } from './auth.guard';
import { AppConfig } from 'src/config/interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService<AppConfig>,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Redirect()
  @Post('login_old')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginUserDto,
  ) {
    const user = await this.authService.signIn(
      loginDto.username,
      loginDto.password,
    );

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (!user.access_token)
      throw new HttpException(
        'Server error while logging in',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
    res.cookie('user_jwt', user.access_token, {
      ...this.configService.get('cookie'),
      expires: new Date(
        Date.now() + parseInt(this.configService.get<string>('cookie.expires')),
      ),
    });

    return {
      ...user,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @UseGuards(LocalAuthGuard)
  @Redirect()
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    if (!req.user.access_token)
      throw new HttpException(
        'Server error while logging in',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
    res.cookie('user_jwt', req.user.access_token, {
      ...this.configService.get('cookie'),
      expires: new Date(
        Date.now() + parseInt(this.configService.get<string>('cookie.expires')),
      ),
    });

    return {
      ...req.user,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @Redirect()
  async signUp(@Body() registerDto: RegisterUserDto) {
    console.log('registerDto', registerDto);
    return {
      response: await this.authService.signUp(registerDto),
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL + '/login',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Redirect()
  @Get('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['user_jwt'];

    console.log('logout: ', req.cookies);

    // remove token from cookie
    res.cookie('user_jwt', '', {
      ...this.configService.get('cookie'),
      expires: new Date(Date.now()),
    });

    return {
      response: await this.authService.logout(token),
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: process.env.FRONTEND_URL + '/login',
    };
  }
}
