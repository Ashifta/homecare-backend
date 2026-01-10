import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantStorage } from './tenant.context';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // TenantId from JWT (preferred) or header
    const tenantId =
      request.user?.tenantId ??
      request.headers['x-tenant-id'];

    if (!tenantId || typeof tenantId !== 'string') {
      throw new BadRequestException(
        'TenantId is required',
      );
    }
    console.log( 'interce');
    // Role from JWT (SUPER_ADMIN, TENANT_ADMIN, PROVIDER, RECEIVER)
    const role: string | undefined = request.user?.role;

    return tenantStorage.run(
      {
        tenantId,
        role,
      },
      () => next.handle(),
    );
  }
}
