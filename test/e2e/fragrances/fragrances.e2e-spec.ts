// E2E tests for public fragrance catalog endpoints.
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../../src/app.module';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('Fragrances (e2e)', () => {
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

  // Public list endpoint should return 200 and an array.
  it('GET /api/fragrances returns list', async () => {
    const res = await request(app.getHttpServer()).get('/api/fragrances').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
