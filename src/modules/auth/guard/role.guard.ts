import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    let { user } = context.switchToHttp().getRequest();

    user = {
      ...user,
      roles: ['USER'],
    };

    const isAllow = requireRoles.some((role) => user.roles.includes(role));

    if (!isAllow) {
      throw new ForbiddenException('Your permissions is allowed !');
    }

    return isAllow;
  }
}
