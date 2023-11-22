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
import { AuthGuard } from 'src/auth/auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Redirect('https://ann.xed.im', 301) // TODO: remove hardcoded url
  @Post('login')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginUserDto,
  ) {
    const user = await this.authService.signIn(
      loginDto.username,
      loginDto.password,
    );

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (user.access_token) {
      // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
      res.cookie('user_jwt', user.access_token, {
        expires: new Date(
          Date.now() + parseInt(this.configService.get('COOKIE_EXPIRES')),
        ),
        httpOnly: this.configService.get('COOKIE_HTTP_ONLY'),
        secure: this.configService.get('COOKIE_SECURE'),
        domain: this.configService.get('COOKIE_DOMAIN'),
        sameSite: this.configService.get('COOKIE_SAME_SITE'),
      });
    }

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @Redirect('https://ann.xed.im/login', 301) // TODO: remove hardcoded url
  signUp(@Body() registerDto: RegisterUserDto) {
    console.log('registerDto', registerDto);
    return this.authService.signUp(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Redirect('https://ann.xed.im/login', 301) // TODO: remove hardcoded url
  @Get('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    // get token from cookie
    const token = req.cookies['user_jwt'];
    console.log('logout for', token);

    // remove token from cookie
    res.cookie('user_jwt', '', {
      expires: new Date(Date.now()),
      httpOnly: this.configService.get('COOKIE_HTTP_ONLY'),
      secure: this.configService.get('COOKIE_SECURE'),
      domain: this.configService.get('COOKIE_DOMAIN'),
      sameSite: this.configService.get('COOKIE_SAME_SITE'),
    });

    // invalidate token
    // const token = req.headers.authorization.split(' ')[1]; // TODO check if authorization header is present
    return this.authService.logout(token);
  }
}
