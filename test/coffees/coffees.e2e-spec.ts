import { INestApplication, createParamDecorator, HttpStatus, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  const coffee = {
    name: 'Shipwrick Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanila']
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres', // type of our database
          host: 'localhost', // database host
          port: 5433, // database host
          username: 'postgres', // username
          password: '123456', // user password
          database: 'nestdb', // name of our database,
          autoLoadEntities: true, // models will be loaded automatically (you don't have to explicitly specify the entities: [] array)
          synchronize: true, // your entities will be synced with the database (ORM will map entity definitions to corresponding SQL tabled), every time you run the application (recommended: disable in the production)
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Con esto limpia el objeto, removiendo campos no definidas
        forbidNonWhitelisted: true, // Con esto valida y lanza un error por campos no definidos (Solo se usa combinado con whitelist: true)
        transform: true, // Sirve para transformar los datos de entrada del request al tipo de datos deseado, ya sea number, string o custom DTO.
        transformOptions: {
          enableImplicitConversion: true, // Se usa cuando se quiere obviar la implementación del decorador Type en los DTO
        },
      }),
    );
    await app.init();
  });

  it('Create [POST /]', async () => {

    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      // .set('Authorization', process.env.API_KEY)
      .expect(HttpStatus.CREATED)
      .then(({body}) => {
        const expectedCoffee = jasmine.objectContaining({
          ...coffee,
          flavors: jasmine.arrayContaining(
            coffee.flavors.map(name => jasmine.objectContaining({ name })),
          )
        });
        expect(body).toEqual(expectedCoffee);
      })

  });
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    app.close();
  });
});
