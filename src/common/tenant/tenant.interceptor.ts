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
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];
    console.log("test");
    if (!tenantId || typeof tenantId !== 'string') {
      throw new BadRequestException('X-Tenant-Id header is required');
    }

    return tenantStorage.run({ tenantId }, () => {
      return next.handle();
    });
  }
}
