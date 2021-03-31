import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {

    const ctx = host.switchToHttp(); // Con este obtenemos los datos de las peticiones y respuestas
    const response = ctx.getResponse<Response>(); // Obtenemos los datos de la respuesta

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error = 
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    response.status(status)
      .json({
        ...error,
        timestamp: new Date().toISOString(),
      })

  }
}
