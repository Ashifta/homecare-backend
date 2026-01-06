import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { tenantStorage } from './tenant.context';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log("Tenan----------------------")
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id']; //not from body but from client UI mapped to the central city of operatrion

    if (!tenantId || typeof tenantId !== 'string') {
      throw new BadRequestException('X-Tenant-Id header is required');
    }

    tenantStorage.run({ tenantId }, () => {});
    return true;
  }
}
