import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {

    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'capuchino',
            brand: 'Tostao',
            flavors: ['chocolate', 'vainilla']
        }
    ]

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>
    ){}

    findAll() {
        return this.coffeeRepository.find()
    }

    async findOne(id: string) {
        // throw 'Error cualquiera para probar'; // Automáticamente arroja 500 e internal server error
        
        const coffee = await this.coffeeRepository.findOne(id);

        this.validateCoffee(coffee, id);

        return coffee;

    }

    create(createCoffeeDto: CreateCoffeeDto) {
        // this.coffees.push(createCoffeeDto);
        const coffee = this.coffeeRepository.create(createCoffeeDto);
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        /*
        const existingCoffee = this.findOne(id);
        if (existingCoffee) {
            // update the existing entity
        }
        */
       const coffee = await this.coffeeRepository.preload({
           id: +id,
           ...updateCoffeeDto
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

}
