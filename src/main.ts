import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory , Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { loadDomainConfig } from './infrastructure/domain/domain-loader';
import { GlobalDomainContext } from './common/domain/global-domain.context';
import { createAppLogger } from './common/logging/logger.factory';
import { ValidationPipe  } from '@nestjs/common';
import { AppDataSource } from './infrastructure/database/datasource';




async function bootstrap() {

  await AppDataSource.initialize(); 

  // 1️⃣ Pre-bootstrap domain load (FAIL FAST)
  const domainConfig = await loadDomainConfig();
  GlobalDomainContext.initialize(domainConfig);

  // 2️⃣ NestJS app
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: false,
  });

  app.useLogger(createAppLogger());


  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);


  await app.listen(process.env.PORT || 3000);
}

bootstrap();
