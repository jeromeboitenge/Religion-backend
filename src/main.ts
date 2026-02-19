import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Urumuri API')
    .setDescription(
      'Rwanda Christian Digital Ecosystem — REST API documentation. ' +
      'Supports Organizations, Churches, Sermons, Events, Devotions, Bible Academy, Community & Moderation.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Auth', 'Authentication & Authorization')
    .addTag('Users', 'User management')
    .addTag('Organizations', 'Christian Organization directory')
    .addTag('Churches', 'Church directory & management')
    .addTag('Sermons', 'Sermon content')
    .addTag('Events', 'Church events')
    .addTag('Announcements', 'Church announcements')
    .addTag('Devotions', 'Daily devotions')
    .addTag('Academy', 'Bible Academy — courses, lessons, quizzes')
    .addTag('Community', 'Community posts & comments')
    .addTag('Moderation', 'Reporting & moderation')
    .addTag('Notifications', 'In-app notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n🚀 Urumuri API running at: http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger docs at:        http://localhost:${port}/api/docs\n`);
}
bootstrap();
