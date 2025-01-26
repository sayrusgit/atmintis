import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AccessTokenGuard } from '@guards/at.guard';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;

  const corsOriginUrl = 'http://' + process.env.CLIENT_URL;
  const reflector = new Reflector();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: corsOriginUrl, credentials: true });
  app.setGlobalPrefix('api');

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AccessTokenGuard(reflector));

  await app.listen(process.env.PORT);
  console.log(`App has started on ${PORT} port`);
}

bootstrap();
