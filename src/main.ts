import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'files'), {
    prefix: '/files/',
  });

  await app.listen(process.env.PORT || 5000, '0.0.0.0');
}
bootstrap();
