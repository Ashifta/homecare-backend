// src/modules/actor/actor.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly service: ActorService) {}

  @Post()
  create(@Body() dto: CreateActorDto) {
    return this.service.create(dto);
  }
}
