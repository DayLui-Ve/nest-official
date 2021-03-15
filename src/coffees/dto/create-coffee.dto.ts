import { IsString } from "class-validator";

/*
    Se coloca readonly como buena práctica
    para que el objeto no sea alterado 
    durante la ejecución de la lógica de negocio
 */
export class CreateCoffeeDto {

    @IsString()
    readonly name: string;

    @IsString()
    readonly brand: string;
    
    @IsString({ each: true })
    readonly flavors: string[];

}
