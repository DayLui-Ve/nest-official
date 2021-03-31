import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Con esto limpia el objeto, removiendo campos no definidas
    forbidNonWhitelisted:true, // Con esto valida y lanza un error por campos no definidos (Solo se usa combinado con whitelist: true)
    transform: true, // Sirve para transformar los datos de entrada del request al tipo de datos deseado, ya sea number, string o custom DTO.
    transformOptions: {
      enableImplicitConversion: true, // Se usa cuando se quiere obviar la implementación del decorador Type en los DTO
    }
  }));
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor()
  );

  const options = new DocumentBuilder()
    .setTitle('Iluvcoffee')
    .setDescription('Coffee Aplicaction')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document); // "api" es la ruta a donde vamos a acceder a swagger
  
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalGuards(new ApiKeyGuard());
  await app.listen(3000);
}
bootstrap();
