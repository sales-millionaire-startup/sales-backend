import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.enableCors({
    origin: 'https://d35dh7a9lkzan1.cloudfront.net', // Frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // HTTP methods to allow
    credentials: true, // Allow credentials if needed
  });
  app.useStaticAssets(join(__dirname, '..', 'files'), {
    prefix: '/files/',
  });

  await app.listen(process.env.PORT || 5000, '0.0.0.0');
}
bootstrap();
