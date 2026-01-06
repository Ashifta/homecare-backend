import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from './../../../common/rbac/roles.enum';

export interface JwtPayload {
  sub: string;
  tenantId: string;
  phoneNumber: string;
  roles: Role[]; // ✅ plural
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    // ✅ THIS LINE WAS MISSING
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
 console.error('🔥 JWT STRATEGY CONSTRUCTOR CALLED');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

async validate(payload: {
  sub: string;
  tenantId: string;
  phoneNumber: string;
  role: Role;
}) {
  const { sub, tenantId, phoneNumber, role } = payload;

  if (!sub || !tenantId || !phoneNumber || !role) {
    throw new UnauthorizedException('Invalid JWT payload');
  }

  return {
    userId: sub,
    tenantId,
    phoneNumber,
    role,
  };
}
}
