import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Shop')
    .setDescription('The shop API description')
    .setVersion('1.0')
    .addTag('shop')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.use(helmet());
  await app.use(cookieParser());

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;
  const HOST = configService.get('HOST') || '0.0.0.0';
  await app.listen(PORT, HOST);
}
bootstrap();
