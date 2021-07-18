import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Con esto limpia el objeto, removiendo campos no definidas
    forbidNonWhitelisted:true, // Con esto valida y lanza un error por campos no definidos (Solo se usa combinado con whitelist: true)
    transform: true, // Sirve para transformar los datos de entrada del request al tipo de datos deseado, ya sea number, string o custom DTO.
    transformOptions:{
      enableImplicitConversion: true,
    }
  }));
  await app.listen(3000);
}
bootstrap();
