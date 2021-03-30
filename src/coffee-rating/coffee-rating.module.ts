import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesModule } from '../coffees/coffees.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule.register({
      type: 'postgres', // type of our database
      host: 'localhost', // database host
      port: 5432, // database host
      username: 'postgres', // username
      password: '123456', // user password
      database: 'nestdb', // name of our database,
    }),
    CoffeesModule
  ],
  providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}
