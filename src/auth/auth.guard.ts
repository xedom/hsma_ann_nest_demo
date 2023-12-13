import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenBlacklistService } from 'src/token-blacklist/token-blacklist.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<AppConfig>,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['user_jwt'];
    // const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Token not found');
    if (await this.tokenBlacklistService.isTokenBlacklisted(token))
      throw new UnauthorizedException(); // TODO

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('auth.jwt.secret'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
