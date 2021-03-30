import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Logger, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { identity } from 'rxjs';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Controller('coffees')
export class CoffeesController {

    private readonly logger = new Logger(CoffeesController.name);

    constructor(
        private readonly coffeesService: CoffeesService,
        @Inject(REQUEST) private readonly request: Request, // Para obtener informacion del request
    ) {
        console.log("CoffeesService Created")
    }

    /*
    @Get()
    findAll(@Res() response){
        response.status(200).send('Action return all coffees');
    }
    */

    @Get()
    findAll(@Query() queryPagination: PaginationQueryDto){
        // const { limit, offset } = queryPagination
        this.logger.log(JSON.stringify(queryPagination), "queryPagination");
        // console.error("HOLA HOLA");
        // return `Action return all coffees: ${limit} | ${offset}`;
        return this.coffeesService.findAll(queryPagination);
    }

    // @Get(':id')
    // findOne(@Param() params){
        // return `this action returns #[${params.id}] coffee`
    // }

    @Get(':id')
    findOne(@Param('id') id: number){
        console.log(typeof id);
        // return `this action returns #[${params.id}] coffee`
        // return `this action returns #[${id}] coffee`
        return this.coffeesService.findOne(''+id);
    }

    /*
    @Post()
    create(@Body('name') body) {
        return body;
        // return 'Action creare coffee'
    }
    */

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createCoffeeDto: CreateCoffeeDto){
        console.log(createCoffeeDto instanceof CreateCoffeeDto);        
        // return body;
        // return 'Action creare coffee'
        return this.coffeesService.create(createCoffeeDto);
        // return createCoffeeDto;
    }

    @Patch('/:id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        // return `this action update #[${id}] coffee`
        console.log('update-start', { id, updateCoffeeDto })
        return this.coffeesService.update(id, updateCoffeeDto);
    }
    
    @Delete('/:id')
    remove(@Param('id') id:string) {
        // return `this action remove #[${id}] coffee`
        return this.coffeesService.remove(id);
    }

}
