import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.HTTP_PORT || 3000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
  Logger.log(
    `If you change the port, please change the environment variable 'HTTP_PORT'.`,
  );
}
bootstrap();
