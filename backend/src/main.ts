import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('URUMURI REGIO API')
    .setDescription('Catholic Youth & Legion Management Platform for Rwanda')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication')
    .addTag('users', 'Users')
    .addTag('groups', 'Groups')
    .addTag('meetings', 'Meetings')
    .addTag('devotions', 'Devotions')
    .addTag('formation', 'Formation')
    .addTag('messaging', 'Messaging')
    .addTag('events', 'Events')
    .addTag('announcements', 'Announcements')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 URUMURI REGIO API: http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
