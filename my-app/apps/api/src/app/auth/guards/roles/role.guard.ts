import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@org/database';
import { ROLES_KEY } from '../../decerators/roles.decerators';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

@Injectable()
export class RoleGuard implements CanActivate {
  /**
   *
   */
  constructor(private readonly reflector:Reflector) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean { 
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass()
      ]
    )

    if(!requiredRole) return true

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

    return requiredRole.includes(request.user.role)
  }
}
