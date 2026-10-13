import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@org/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '@org/database';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    PrismaModule,
    UserModule,
    CategoryModule,
    ProductsModule,
    OrdersModule,
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10
    }])
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
