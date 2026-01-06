import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';


@Controller()
export class AppController {
  @Get()
  root() {
    return {
      status: 'ok',
      service: 'homecare-api',
    };
  }

  @Public()
  @Get('health')
  health() {
    return {
      status: 'health1',
    };
  }



}
