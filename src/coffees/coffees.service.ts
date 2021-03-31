import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

// @Injectable({ scope: Scope.TRANSIENT }) // Se construye tantas veces como importaciones haya en el constructor
// @Injectable({ scope: Scope.DEFAULT }) // Se trabaja con singleton, solo se instacia una vez
// @Injectable({ scope: Scope.REQUEST }) // Se trabaja con singleton, solo se instacia una vez
@Injectable() // Por defecto singleton
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        @Inject(COFFEE_BRANDS) coffeeBrands:string[],
        // private readonly configService: ConfigService,
        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    ){

        // console.log("CoffeesService initialize")
        // El segundo parametro es el valor por defecto si no se encuentra definido la variable de entorno
        // const databaseHost = this.configService.get<string>("DATABASE_HOST", "localhost");
        // Cuando usamos load
        // const databaseHost = this.configService.get<string>("database.host", "localhost2");
        // console.log('databaseHost:', databaseHost);
        // Para usar configuraciones internas del módulo
        // const coffeesConfig = this.configService.get("coffees");
        // console.log('coffeesConfig', coffeesConfig);
        // Para importar directamente el namespace deseado
        console.log(coffeesConfiguration)
        console.log('coffeesConfiguration.foo', coffeesConfiguration.foo)
    }

    findAll(paginationQueryDto: PaginationQueryDto) {
        const { limit, offset } = paginationQueryDto;
        return this.coffeeRepository
            .find({
                relations: ['flavors'],
                skip: offset - 1,
                take: limit
            })
    }

    async findOne(id: string) {
        // throw 'Error cualquiera para probar'; // Automáticamente arroja 500 e internal server error
        
        const coffee = await this.coffeeRepository
            .findOne(id, {
                relations: ['flavors']
            });

        this.validateCoffee(coffee, id);

        return coffee;

    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        // this.coffees.push(createCoffeeDto);

        const flavors = await Promise.all( 
            createCoffeeDto.flavors.map(flavor => this.preloadFlavorByName(flavor))
        );

        const coffee = this.coffeeRepository
            .create({
                ...createCoffeeDto,
                flavors
            });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        /*
        const existingCoffee = this.findOne(id);
        if (existingCoffee) {
            // update the existing entity
        }
        */

        console.log('update@updateCoffeeDto', updateCoffeeDto)

        const flavors = 
            updateCoffeeDto.flavors && 
            (await Promise.all( 
                updateCoffeeDto.flavors.map(flavor => this.preloadFlavorByName(flavor))
            ));

       const coffee = await this.coffeeRepository.preload({
           id: +id,
           ...updateCoffeeDto,
           flavors,
       });

       this.validateCoffee(coffee, id);

       return this.coffeeRepository.save(coffee);

    }

    async remove(id: string) {
        /*
        const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
        if (coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);
        }
        */
       const coffee = await this.findOne(id);
       return this.coffeeRepository.remove(coffee);
    }

    private validateCoffee(coffee: Coffee, id: string) {
        if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
    }

    async recommendCoffee(coffee: Coffee){

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            coffee.recommendations++;

            const event = new Event();
            event.name = 'recommend_coffee';
            event.type = 'coffee';
            event.payload = { coffeeId: coffee.id }

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(event);

            await queryRunner.commitTransaction();
            
        } catch (error) {

            await queryRunner.rollbackTransaction();
            
        } finally {

            await queryRunner.release();

        }

    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        console.log('preloadFlavorByName@name', name)

        const flavor:Flavor = await this.flavorRepository.findOne({ name });

        console.log('preloadFlavorByName@flavor', flavor)

        if (flavor) return flavor;

        return this.flavorRepository.create({ name });

    }

}
