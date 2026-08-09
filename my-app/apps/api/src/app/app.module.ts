import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@org/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '@org/database';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule, AuthModule, PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
