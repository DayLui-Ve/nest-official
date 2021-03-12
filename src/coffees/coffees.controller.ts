import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { identity } from 'rxjs';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {

    constructor(
        private readonly coffeesService: CoffeesService
    ) {

    }

    /*
    @Get()
    findAll(@Res() response){
        response.status(200).send('Action return all coffees');
    }
    */

    @Get()
    findAll(@Query() queryPagination){
        const { limit, offset } = queryPagination
        // return `Action return all coffees: ${limit} | ${offset}`;
        return this.coffeesService.findAll();
    }

    // @Get(':id')
    // findOne(@Param() params){
        // return `this action returns #[${params.id}] coffee`
    // }

    @Get(':id')
    findOne(@Param('id') id: string){
        // return `this action returns #[${params.id}] coffee`
        // return `this action returns #[${id}] coffee`
        return this.coffeesService.findOne(id);
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
    create(@Body() body){
        // return body;
        // return 'Action creare coffee'
        return this.coffeesService.create(body);
    }

    @Patch('/:id')
    update(@Param('id') id:string, @Body() body) {
        // return `this action update #[${id}] coffee`
        return this.coffeesService.update(id, body);
    }
    
    @Delete('/:id')
    remove(@Param('id') id:string) {
        // return `this action remove #[${id}] coffee`
        return this.coffeesService.remove(id);
    }

}
