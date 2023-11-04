import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      // more info on https://github.com/nestjs/jwt/blob/master/README.md
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10800s' }, // TODO: change this to 1h
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
