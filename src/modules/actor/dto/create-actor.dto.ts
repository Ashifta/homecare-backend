// src/modules/actor/dto/create-actor.dto.ts
import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateActorDto {
  @IsNotEmpty()
  tenantId!: string;

  @IsEnum(['RECEIVER', 'PROVIDER', 'CENTRAL'])
  type!: 'RECEIVER' | 'PROVIDER' | 'CENTRAL';

  @IsNotEmpty()
  subType!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
