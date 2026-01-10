import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true, // Allow all origins for now (simplifies header/subdomain checks)
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
