import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
    imports: [
        ConfigModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard
        }
    ]
})
export class CommonModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        // consumer.apply(LoggingMiddleware).forRoutes('*'); // Para todas las rutas
        // consumer.apply(LoggingMiddleware).exclude('coffees'); // Para ignorar ciertas rutas
        consumer.apply(LoggingMiddleware).forRoutes({ path: 'coffees', method: RequestMethod.GET }); // Para un prefijo y un método en especifico
    }

}
