import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // gelen verileri dtoya dönüştür
      transformOptions: { enableImplicitConversion: true }, // verileri dönüştür
      whitelist: true, // sadece belirtilen alanları kabul et
      forbidNonWhitelisted: false, // fazladan veride hata fırlat
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Vehicle Tracking API')
    .setDescription('The Vehicle Tracking API description')
    .setVersion('1.0')
    .addTag('vehicle-tracking')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
