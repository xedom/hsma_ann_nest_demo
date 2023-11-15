import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
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
  signUp(@Body() registerDto: RegisterUserDto) {
    console.log('registerDto', registerDto);
    return this.authService.signUp(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1]; // TODO check if authorization header is present
    console.log('logout', token);
    return this.authService.logout(token);
  }
}
