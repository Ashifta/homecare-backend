import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';
import { AppDataSource } from '../../infrastructure/database/datasource';
import { UserRole } from '../../modules/users/user-role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log("no role");
    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.debug('No roles required for endpoint');
      return true;
    }

    if (!user?.userId || !user?.tenantId) {
      this.logger.warn('Invalid user context', user);
      throw new ForbiddenException('Invalid user context');
    }

    if (!request._roleSet) {
      const roleRepo = AppDataSource.getRepository(UserRole);
      console.log("appsource");
      const roles = await roleRepo.find({
        where: {
          tenantId: user.tenantId,
          userId: user.userId,
        },
      });

      request._roleSet = roles.map(r => r.role);

      this.logger.debug('Roles loaded from DB', {
        tenantId: user.tenantId,
        userId: user.userId,
        roles: request._roleSet,
      });
    }

    const roleSet: string[] = request._roleSet;

    if (!requiredRoles.some(r => roleSet.includes(r))) {
      this.logger.warn('RBAC denied', {
        requiredRoles,
        roleSet,
      });
      throw new ForbiddenException('Insufficient role');
    }

    this.logger.debug('RBAC granted', { roleSet });
    return true;
  }
}
