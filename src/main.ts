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

  // Keep-Alive for Render.com (Prevents sleep after 15mins inactivity)
  const pingInterval = 14 * 60 * 1000; // 14 minutes
  const backendUrl = process.env.API_URL || 'http://localhost:3000';

  console.log(`[KeepAlive] Started pinging ${backendUrl} every 14 minutes.`);

  const ping = () => {
    setTimeout(async () => {
      try {
        const res = await fetch(`${backendUrl}/api`);
        console.log(`[KeepAlive] Ping status: ${res.status} ${res.statusText}`);
      } catch (error) {
        console.error('[KeepAlive] Ping failed:', error.message);
      } finally {
        ping(); // Recurse
      }
    }, pingInterval);
  };

  ping();
}
bootstrap();
