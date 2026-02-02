# App Bootstrap

Files
- src/main.ts
- src/app.module.ts
- src/app.controller.ts

## Purpose
Defines how the NestJS application starts, applies global middleware, validation, Swagger docs, and wires feature modules.

## main.ts
Responsibilities
- Create the Nest application from `AppModule`.
- Apply security headers (helmet).
- Enable CORS for browser clients.
- Add global validation pipe for DTOs.
- Register global exception filter for consistent error responses.
- Create Swagger docs at `/api/docs`.
- Start the HTTP server.

Key runtime steps
1. Create app instance with `NestFactory.create(AppModule)`.
2. Apply `helmet()` for HTTP hardening.
3. Enable request logging middleware.
4. Enable CORS using `CORS_ORIGIN`.
5. Set global prefix `api`.
6. Register `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `transform`.
7. Register `HttpExceptionFilter`.
8. Build Swagger `DocumentBuilder` configuration and serve UI.
9. Listen on `PORT`.

## app.module.ts
Responsibilities
- Load environment configuration globally.
- Register global rate limiting (throttling).
- Import all domain modules.
- Provide global guards.

Modules imported
- AuthModule
- UsersModule
- FragrancesModule
- NotesModule
- CollectionsModule
- OrdersModule
- PrismaModule

## app.controller.ts
Responsibilities
- Provide a health check endpoint.
- Provide a default welcome endpoint.

Routes
- GET /api/health
- GET /api
