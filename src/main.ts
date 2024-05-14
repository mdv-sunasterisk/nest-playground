import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentation for NestJS Playground API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('auth', app, document, { swaggerOptions: { tagsSorter: 'alpha' } });
  // SwaggerModule.setup('blogs', app, document, { swaggerOptions: { tagsSorter: 'alpha' } });

  await app.listen(3000);
}
bootstrap();
