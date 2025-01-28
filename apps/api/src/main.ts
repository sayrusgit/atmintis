import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AccessTokenGuard } from '@guards/at.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import fs from 'fs/promises';
import { RolesGuard } from '@guards/roles.guard';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const BUILD = process.env.BUILD || 'dev';

  const key = BUILD === 'prod' ? await fs.readFile(process.env.SSL_KEY_PATH, 'utf-8') : '';
  const cert = BUILD === 'prod' ? await fs.readFile(process.env.SSL_CERT_PATH, 'utf-8') : '';

  const httpsOptions = BUILD === 'prod' ? { key, cert } : null;

  const app =
    BUILD === 'prod'
      ? await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions })
      : await NestFactory.create<NestExpressApplication>(AppModule);

  const corsOriginUrl = BUILD === 'prod' ? process.env.CLIENT_URL : process.env.DEV_CLIENT_URL;

  app.enableCors({ origin: corsOriginUrl, credentials: true });
  app.setGlobalPrefix('api');

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cookieParser());

  const reflector = new Reflector();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AccessTokenGuard(reflector));
  app.useGlobalGuards(new RolesGuard(reflector));

  await app.listen(process.env.PORT);
  console.log(`App has started on ${PORT} port`);
}

bootstrap();
