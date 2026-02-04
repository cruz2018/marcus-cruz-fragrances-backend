import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FragrancesModule } from './fragrances/fragrances.module';
import { NotesModule } from './notes/notes.module';
import { CollectionsModule } from './collections/collections.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Load environment variables from .env and make them available globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Basic rate limiting (protects free tiers from abuse)
    // THROTTLE_TTL = time window in seconds
    // THROTTLE_LIMIT = max requests per window per IP
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: Number(process.env.THROTTLE_TTL ?? 60),
          limit: Number(process.env.THROTTLE_LIMIT ?? 100),
        },
      ],
    }),

    // Shared Prisma client for all modules
    PrismaModule,

    // Feature modules (organized by business domain)
    AuthModule,
    UsersModule,
    FragrancesModule,
    NotesModule,
    CollectionsModule,
    OrdersModule,
  ],
  // Root controller for health and default routes
  controllers: [AppController],
  providers: [
    // Root service (placeholder for app-level helpers)
    AppService,
    // Apply throttling guard globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
