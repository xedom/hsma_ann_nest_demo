import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.use(helmet());
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
