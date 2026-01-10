// src/modules/actor/dto/create-actor.dto.ts
import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateActorDto {
  @IsNotEmpty()
  tenantId!: string;

  @IsEnum(['RECEIVER', 'PROVIDER', 'TENANT_ADMIN'])
  type!: 'RECEIVER' | 'PROVIDER' | 'TENANT_ADMIN';

  @IsNotEmpty()
  subType!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
