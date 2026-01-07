
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('BOOTSTRAP');
  try {
    logger.log('BOOTSTRAP_START');
    const app = await NestFactory.create(AppModule);
    logger.log('NEST_FACTORY_CREATED');

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`SERVER_LISTENING_ON_${port}`);
  } catch (err) {
    logger.error('BOOTSTRAP_FATAL_ERROR', err);
    process.exit(1);
  }
}
bootstrap();
