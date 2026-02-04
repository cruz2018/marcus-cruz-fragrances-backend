// E2E tests for orders endpoints (auth required).
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../../src/app.module';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('Orders (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // Build a NestJS app instance for E2E testing.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Match the real app configuration.
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Orders endpoints require auth; verify unauthorized requests are rejected.
  it('POST /api/orders rejects without token', async () => {
    await request(app.getHttpServer()).post('/api/orders').send({ items: [] }).expect(401);
  });

  it('GET /api/orders/me rejects without token', async () => {
    await request(app.getHttpServer()).get('/api/orders/me').expect(401);
  });
});
