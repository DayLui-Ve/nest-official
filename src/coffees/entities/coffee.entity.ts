import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from './flavor.entity';

// @Entity('coffees') // sql table === 'coffees'
// @Index(['name', 'brand']) // Cuando se quiere indicar varias columnas indices
@Entity() // sql table === 'coffee'
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Index()
    @Column()
    name: string;

    @Column()
    description: string
    
    @Column()
    brand: string;
    
    @Column({ default: 0 })
    recommendations: number;
    
    @JoinTable()
    @ManyToMany(
        type => Flavor, 
        (flavor) => flavor.coffees,
        {
            cascade: true // Para que inserte automáticamente en las tablas hijas
        }
    )
    flavors: Flavor[];
}