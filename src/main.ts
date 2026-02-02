import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

async function bootstrap() {
  // Create the NestJS application using the root AppModule
  const app = await NestFactory.create(AppModule);

  // Security headers (helps against common web vulnerabilities)
  app.use(helmet());

  // Log each request with a structured JSON output
  app.use(new RequestLoggerMiddleware().use);

  // Allow the frontend (Nuxt/Vue) to call the API from a browser
  // CORS_ORIGIN can be a comma-separated list or '*' for any origin
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' });

  // Prefix all routes with /api (e.g., /api/fragrances)
  app.setGlobalPrefix('api');

  // Validate all incoming DTOs
  // - whitelist: strip unknown fields
  // - forbidNonWhitelisted: throw if unknown fields exist
  // - transform: convert payloads to DTO types
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // Format all thrown errors consistently as JSON
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger / OpenAPI setup for live API documentation
  const config = new DocumentBuilder()
    .setTitle('Marcus Cruz Fragrances API')
    .setDescription('Premium fragrance brand backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start HTTP server (Render/Railway/Fly will provide PORT)
  await app.listen(process.env.PORT ?? 3000);
}

// Run the bootstrap function
bootstrap();
