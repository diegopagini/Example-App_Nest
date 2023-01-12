import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      // forbidNonWhitelisted: true. This is to avoid that any one send me no needed data.
      whitelist: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
