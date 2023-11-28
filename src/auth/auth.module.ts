import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ConfigModule } from '@nestjs/config';
import { TokenBlacklistModule } from 'src/token-blacklist/token-blacklist.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TokenBlacklistModule,
    JwtModule.register({
      // more info on https://github.com/nestjs/jwt/blob/master/README.md
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10800s' }, // TODO: change this to 1h
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
