import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/*
    Se coloca readonly como buena práctica
    para que el objeto no sea alterado 
    durante la ejecución de la lógica de negocio
 */
export class CreateCoffeeDto {

    @ApiProperty({ description: 'The name of a coffee' })
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'The brand of a coffee' })
    @IsString()
    readonly brand: string;
    
    @ApiProperty({ examples: [] })
    @IsString({ each: true })
    readonly flavors: string[];

}
