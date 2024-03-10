import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import envConfig from './configs/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/v1/api');
  await app.listen(3000);
}
bootstrap();
