import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "./create-coffee.dto";

/* 
    Como estamos usando el método PATCH. Que
    es editar la entidad parcialmente, entonces
    debemos indicar como buena práctica, que
    los atributos son opcionales
*/

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto){}
