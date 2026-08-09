/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import cookieParser from "cookie-parser";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true
  })

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const configService = app.get(ConfigService)

  const swaggerConfig = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addCookieAuth('accessToken')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup(`${globalPrefix}/docs`, app, cleanupOpenApiDoc(document))

  const port = configService.getOrThrow<number>("PORT");
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );

  Logger.log(`📖 Swagger is running on: http://localhost:${port}/${globalPrefix}/docs`)
}


bootstrap().catch((error) => {
  Logger.error("Error starting server", error)
  process.exit(1)
});
