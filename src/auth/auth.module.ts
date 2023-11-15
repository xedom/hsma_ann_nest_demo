import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlacklistedToken,
  BlacklistedTokenSchema,
} from './schema/BlacklistedToken.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.register({
      // more info on https://github.com/nestjs/jwt/blob/master/README.md
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10800s' }, // TODO: change this to 1h
    }),
    MongooseModule.forFeature([
      { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
