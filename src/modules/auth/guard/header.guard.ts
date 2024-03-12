import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Headers } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers[Headers.CLIENT_ID];
    const accessToken = request.headers[Headers.AUTHENTICATION];

    if (!userId && !accessToken) {
      throw new UnauthorizedException('Invalid request or missing something !');
    }

    return true;
  }
}
