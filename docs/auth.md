# Auth Module

Files
- src/auth/auth.module.ts
- src/auth/auth.controller.ts
- src/auth/auth.service.ts
- src/auth/jwt.strategy.ts
- src/auth/dto/login.dto.ts
- src/auth/dto/register.dto.ts
- src/common/guards/jwt-auth.guard.ts
- src/common/guards/roles.guard.ts
- src/common/decorators/public.decorator.ts
- src/common/decorators/roles.decorator.ts
- src/common/decorators/current-user.decorator.ts
- src/common/types/jwt-payload.ts

## Purpose
Handles user registration and login using JWT, and enforces authorization for protected routes.

## AuthService
Responsibilities
- Create users with hashed passwords.
- Validate login credentials.
- Issue JWT access tokens.

Flow
- Register: check email uniqueness, hash password with bcrypt, create user, return JWT.
- Login: validate user and password, return JWT.

## JwtStrategy
- Extracts JWT from `Authorization: Bearer <token>`.
- Validates token signature and expiration.
- Attaches payload to `request.user`.

## Guards and Decorators
- `JwtAuthGuard`: protects routes requiring authentication.
- `RolesGuard`: enforces role-based access control.
- `@Roles(...)`: declares allowed roles for a route.
- `@Public()`: bypasses auth for open routes.
- `@CurrentUser()`: injects the JWT payload.

## Endpoints
- POST /api/auth/register
- POST /api/auth/login

## DTOs
- `RegisterDto`: email, password, optional first/last name.
- `LoginDto`: email and password.
