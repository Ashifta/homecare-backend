
import { Controller, Post, Body } from '@nestjs/common';
import { ActorService } from './actor.service';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post()
  async create(@Body() body: any) {
    return this.actorService.createActor(body);
  }
}
