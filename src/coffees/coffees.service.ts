import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity'

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

    findAll() {
        return this.coffees;
    }

    findOne(id: string) {
        // throw 'Error cualquiera para probar'; // Automáticamente arroja 500 e internal server error
        
        const coffee = this.coffees.find(item => item.id === +id);

        if (!coffee) {
            // throw new HttpException(`Coffe #${id} not found`, HttpStatus.NOT_FOUND)            ;
            throw new NotFoundException(`Coffe #${id} not found`);
        }

        return coffee;

    }

    create(createCoffeeDto: any) {
        this.coffees.push(createCoffeeDto);
    }

    update(id: string, updateCoffeeDto: any) {
        const existingCoffee = this.findOne(id);
        if (existingCoffee) {
            // update the existing entity
        }
    }

    remove(id: string) {
        const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
        if (coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);
        }
    }

}
