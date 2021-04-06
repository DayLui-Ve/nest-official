import { Injectable, Module, Scope } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coffee,
            Flavor,
            Event
        ]),
        ConfigModule.forFeature(coffeesConfig),
    ],
    controllers: [
        CoffeesController,
    ],
    providers: [
        CoffeesService,
        {
            provide: COFFEE_BRANDS,
            // useValue: [ 'buddy brew', 'nescafe' ]
            // useFactory cuando se requiere importacion dinamica
            // Note "async" here, and Promise/Async event inside the Factory function 
            // Could be a database connection / API call / etc
            // In our case we're just "mocking" this type of event with a Promise
            useFactory: async (connection: Connection): Promise<string[]> => {
                // const coffeeBrands = await connection.query('SELECT * ...');
                const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
                console.log("[!] Async factory")
                return coffeeBrands;
            },
            inject: [Connection],
            scope: Scope.DEFAULT
        }
    ], 
    exports: [
        CoffeesService
    ]
})
export class CoffeesModule {}

/* useFactory con dependency injection en el modulo
@Injectable()
export class CoffeeBrandsFactory{
    create(){
        return [ 'buddy brew', 'nescafe' ];
    }
}

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coffee,
            Flavor,
            Event
        ]),
    ],
    controllers: [
        CoffeesController,
    ],
    providers: [
        CoffeesService,
        CoffeeBrandsFactory,
        {
            provide: COFFEE_BRANDS,
            // useValue: [ 'buddy brew', 'nescafe' ]
            // useFactory cuando se requiere importacion dinamica
            useFactory: (coffeeBrandsFactory:CoffeeBrandsFactory) => coffeeBrandsFactory.create(),
            inject: [CoffeeBrandsFactory]
        }
    ], 
    exports: [
        CoffeesService
    ]
})
export class CoffeesModule {}
*/

/* Para usar clases con process.env.NODE_ENV
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coffee,
            Flavor,
            Event
        ]),
    ],
    controllers: [
        CoffeesController,
    ],
    providers: [
        CoffeesService,
        {
            provide: ConfigService,
            useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService:ProductionConfigService,
        },
        {
            provide: COFFEE_BRANDS,
            useValue: [ 'buddy brew', 'nescafe' ]
        }
    ], 
    exports: [
        CoffeesService
    ]
})
export class CoffeesModule {}
*/

/* Mocks, importacion complicada y uso de token's string para providers
// Se puede implementar Mocks para alterar el comportamiento de un provide
class MockCoffeesService {}

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coffee,
            Flavor,
            Event
        ]),
    ],
    controllers: [
        CoffeesController,
    ],
    // Forma simple
    // providers: [
    //     CoffeesService
    // ]
    // --Forma compleja--
    // Para alterar el comportamiento del provider
    // providers: [
    //     {
    //         provide: CoffeesService,
    //         useClass: MockCoffeesService
    //     }
    // ], 
    providers: [
        {
            provide: CoffeesService,
            useClass: CoffeesService
        },
        {
            provide: COFFEE_BRANDS,
            useValue: [ 'buddy brew', 'nescafe' ]
        }
    ], 
    exports: [
        CoffeesService
    ]
})
export class CoffeesModule {}
*/