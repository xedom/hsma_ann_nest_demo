import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.authService.signUp(signUpDto);
  }
}
