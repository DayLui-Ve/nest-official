import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {

    @IsOptional()
    @IsPositive()
    // @Type(() => Number) // Se comentó porque se colocar la transformación de forma global
    readonly limit: number;

    @IsOptional()
    @IsPositive()
    // @Type(() => Number) // Se comentó porque se colocar la transformación de forma global
    readonly offset:number;

}
