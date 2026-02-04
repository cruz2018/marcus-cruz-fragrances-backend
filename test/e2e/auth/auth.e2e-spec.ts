// E2E tests for authentication flows (register + login).
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../../src/app.module';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('Auth (e2e)', () => {
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

  // Auth flow: register → login → get token.
  it('registers and logs in a user', async () => {
    // Use a unique email per run to avoid collisions.
    const email = `e2e_${Date.now()}@marcuscruz.com`;
    const password = 'StrongPass123!';

    // Register a new user.
    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(201);

    // Validate access token.
    expect(registerRes.body).toHaveProperty('accessToken');
    expect(typeof registerRes.body.accessToken).toBe('string');

    // Login with the same credentials.
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201);

    // Validate login access token.
    expect(loginRes.body).toHaveProperty('accessToken');
    expect(typeof loginRes.body.accessToken).toBe('string');
  });
});
