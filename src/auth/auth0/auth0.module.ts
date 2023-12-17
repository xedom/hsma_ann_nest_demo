import { Module } from '@nestjs/common';

import { UsersModule } from '../../users/users.module';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { Auth0Controller } from './auth0.controller';
import { Auth0Strategy } from './auth0.strategy';

@Module({
  imports: [JwtAuthModule, UsersModule],
  controllers: [Auth0Controller],
  providers: [Auth0Strategy],
})
export class Auth0Module {}
