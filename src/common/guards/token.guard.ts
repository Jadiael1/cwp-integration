import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

interface TokenRequestBody {
  key?: string;
}

type TokenRequest = Request<any, any, TokenRequestBody>;

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TokenRequest>();

    const key: string | undefined = request.body?.key;
    if (!key) {
      throw new UnauthorizedException('Token not provided');
    }

    const apiToken = this.configService.get<string>('API_TOKEN');

    if (!apiToken || key !== apiToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
