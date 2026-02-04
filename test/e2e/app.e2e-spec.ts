import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../src/app.module';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';

// Deprecated: split into per-endpoint specs under test/e2e/*
describe.skip('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // Build a NestJS app instance for E2E testing.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Match the real app settings for E2E correctness.
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

  // Health check: verifies the app boots and responds.
  it('GET /api/health returns ok', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  // Auth flow: ensures registration and login work end-to-end.
  it('Auth flow: register → login → get token', async () => {
    // Use a unique email to avoid collisions.
    const email = `e2e_${Date.now()}@marcuscruz.com`;
    const password = 'StrongPass123!';

    // Register a new user.
    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(201);

    // Validate access token returned.
    expect(registerRes.body).toHaveProperty('accessToken');
    expect(typeof registerRes.body.accessToken).toBe('string');

    // Login with the same credentials.
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201);

    // Validate login access token returned.
    expect(loginRes.body).toHaveProperty('accessToken');
    expect(typeof loginRes.body.accessToken).toBe('string');
  });
});
