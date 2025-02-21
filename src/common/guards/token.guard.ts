import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Se a requisição não tiver corpo ou não possuir a chave 'key'
    if (!request.body || !request.body.key) {
      throw new UnauthorizedException('Token not provided');
    }

    // Verifica se o token recebido (em request.body.key) é igual ao token definido no .env
    const apiToken = this.configService.get<string>('API_TOKEN');
    if (request.body.key !== apiToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}