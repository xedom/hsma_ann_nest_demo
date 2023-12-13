import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenBlacklistModule } from 'src/token-blacklist/token-blacklist.module';
import { LocalStrategy } from './local/local-auth.strategy';
import { AppConfig } from 'src/config/interfaces';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TokenBlacklistModule,
    JwtModule.registerAsync({
      global: true,
      // more info on https://github.com/nestjs/jwt/blob/master/README.md
      // available options: https://github.com/auth0/node-jsonwebtoken#usage
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        secret: configService.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<number>('auth.jwt.expiresInSeconds'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
