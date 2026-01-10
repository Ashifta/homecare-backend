import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ActorService } from './actor.service';
import { JwtAuthGuard } from './../../common/auth/jwt-auth.guard'


@Controller('actors')
@UseGuards(JwtAuthGuard)
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post()
  async create(@Body() body: any) {
    return this.actorService.createActor(body);
  }
}
