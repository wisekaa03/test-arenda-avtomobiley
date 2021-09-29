import {
  addDays,
  differenceInDays,
  formatISO,
  isSaturday,
  isSunday,
  getDay,
  setDay,
  subDays,
} from 'date-fns';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Client, ClientConfig, QueryResult } from 'pg';
import { PG_CLIENT } from './db.constants';
import { Car } from '../graphql/models/car.model';
import { Rent } from '../graphql/models/rent.model';
import { Tariff } from '../graphql/models/enums.model';
import { CarInput } from '../graphql/models/car.input.model';
import { RentInput } from '../graphql/models/rent.input.model';

@Injectable()
export class DbService implements OnApplicationBootstrap {
  private logger = new Logger(DbService.name);
  public pgClient: Client;

  constructor(@Inject(PG_CLIENT) private readonly options: ClientConfig) {
    this.pgClient = new Client(options);
  }

  private log(query: QueryResult) {
    let log = `command: ${query.command}`;
    if (query.rowCount) {
      log += ` rowCount: ${query.rowCount} rows: ${JSON.stringify(query.rows)}`;
    }
    this.logger.log(log);
  }

  async onApplicationBootstrap() {
    await this.pgClient.connect();

    let query = await this.pgClient.query('DROP TABLE IF EXISTS car CASCADE');
    this.log(query);

    query = await this.pgClient.query('DROP TABLE IF EXISTS rental CASCADE');
    this.log(query);

    query = await this.pgClient.query(
      'DROP TYPE IF EXISTS Tariff_enum CASCADE',
    );
    this.log(query);

    query = await this.pgClient.query(
      'CREATE TABLE car (\
        id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\
        brand VARCHAR(128) NOT NULL,\
        model VARCHAR(128) NOT NULL,\
        licensePlate VARCHAR(64) NOT NULL,\
        vin VARCHAR(64) NOT NULL UNIQUE\
      )',
    );
    this.log(query);

    query = await this.pgClient.query(
      "CREATE TYPE tariff_enum AS ENUM\
      ('first', 'second', 'third')",
    );
    this.log(query);

    query = await this.pgClient.query(
      'CREATE TABLE rental (\
        id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\
        car_id INT NOT NULL REFERENCES car,\
        tariff tariff_enum NOT NULL,\
        start_date DATE NOT NULL,\
        end_date DATE NOT NULL,\
        price INT NOT NULL\
      )',
    );
    this.log(query);

    // Fill cars
    await this.insertCar('Lada', 'Niva', 'a111aa123', 'XUUUF756170002811');
    await this.insertCar('Lada', 'Vesta', 'a112aa123', 'XUUUF756170002812');
    await this.insertCar('Lada', 'Priora', 'a113aa123', 'XUUUF756170002813');
    await this.insertCar('VAZ', '2206', 'a114aa123', 'XUUUF756170002814');
    await this.insertCar(
      'SsangYong',
      'Kyron II',
      'о360ав123',
      'Z8USOA1KSB0008987',
    );

    // Fill rent
    const cars = await this.selectCars({});
    [...Array(100).keys()].forEach(async () => {
      const randomCar = cars[Math.floor(Math.random() * (cars.length - 1))].id;
      const randomTariff =
        Object.values(Tariff)[
          Math.floor(Math.random() * Object.values(Tariff).length)
        ];
      let start_date = new Date(
        '2021-' +
          (Math.floor(Math.random() * 12) + 1) +
          '-' +
          (Math.floor(Math.random() * 28) + 1),
      );
      if (getDay(start_date) === 0 || getDay(start_date) === 6) {
        start_date = setDay(start_date, Math.floor(Math.random() * 5) + 1);
      }
      let end_date = addDays(start_date, Math.floor(Math.random() * 30));
      if (getDay(end_date) === 0 || getDay(end_date) === 6) {
        end_date = subDays(end_date, 2);
      }
      const [price] = await this.returnPriceCar({
        car: { id: randomCar },
        tariff: randomTariff,
        start_date,
        end_date,
      });

      await this.insertRent(
        randomCar,
        randomTariff,
        start_date,
        end_date,
        price,
      );
    });
  }

  async insertCar(
    brand: string,
    model: string,
    licensePlate: string,
    vin: string,
  ): Promise<Car[]> {
    const query = await this.pgClient.query<Car>(
      `INSERT INTO car (brand, model, licenseplate, vin) VALUES ('${brand}', '${model}', '${licensePlate}', '${vin}') RETURNING *`,
    );
    this.log(query);

    return query.rows;
  }

  async car(car: CarInput): Promise<Car> {
    if (car.id) {
      const query = await this.pgClient.query<Car>(
        `SELECT * FROM car WHERE id=${car.id}`,
      );
      this.log(query);

      return query.rows[0];
    }

    if (car.vin) {
      const query = await this.pgClient.query<Car>(
        `SELECT * FROM car WHERE vin='${car.vin}'`,
      );
      this.log(query);

      return query.rows[0];
    }

    if (car.licenseplate) {
      const query = await this.pgClient.query<Car>(
        `SELECT * FROM car WHERE licenseplate='${car.licenseplate}'`,
      );
      this.log(query);

      return query.rows[0];
    }
  }

  async returnPriceCar(
    rent: RentInput,
    previousRents = true,
  ): Promise<[number, Car]> {
    const car = await this.car(rent.car);
    if (!car) {
      throw new UnprocessableEntityException('Не найдено автомобиля');
    }

    const diff = differenceInDays(rent.end_date, rent.start_date);
    if (diff < 0) {
      throw new UnprocessableEntityException(
        'Неправильно расположены даты, поменяйте пожалуйста',
      );
    }
    if (diff > 30) {
      this.logger.error(JSON.stringify(rent));
      throw new UnprocessableEntityException(
        'Максимальный срок аренды автомобиля составляет 30 дней',
      );
    }

    if (isSaturday(rent.start_date) || isSunday(rent.start_date)) {
      throw new UnprocessableEntityException(
        'Начало аренды выпадает на субботу или воскресенье',
      );
    }
    if (isSaturday(rent.end_date) || isSunday(rent.end_date)) {
      throw new UnprocessableEntityException(
        'Конец аренды выпадает на субботу или воскресенье',
      );
    }

    // Tariff
    let price = 0;
    switch (rent.tariff) {
      case Tariff.first:
      default:
        price = 270;
        break;
      case Tariff.second:
        price = 330;
        break;
      case Tariff.third:
        price = 390;
        break;
    }

    // Discount
    if (diff >= 3 && diff <= 5) {
      price *= 0.95;
    }
    if (diff >= 6 && diff <= 14) {
      price *= 0.9;
    }
    if (diff >= 15 && diff <= 30) {
      price *= 0.85;
    }

    if (previousRents) {
      const carRents = await this.selectRental({
        where: { car_id: car.id },
        eager: false,
      });
      carRents.forEach((carRent) => {
        const abs = differenceInDays(rent.start_date, carRent.end_date);
        if (abs < 3) {
          throw new UnprocessableEntityException(
            'Пауза между бронированиями должна составлять 3 дня',
          );
        }
      });
    }

    return [Math.round(price), car];
  }

  async insertRent(
    car_id: number,
    tariff: Tariff,
    start_date: Date,
    end_date: Date,
    price: number,
  ): Promise<Rent[]> {
    const query = await this.pgClient.query<Rent>(
      `INSERT INTO rental (car_id, tariff, start_date, end_date, price) VALUES ('${car_id}', '${tariff}',` +
        `'${formatISO(start_date)}', '${formatISO(end_date)}', '${price}'` +
        `) RETURNING *`,
    );
    this.log(query);

    return query.rows;
  }

  async selectCars({
    where,
  }: {
    where?: {
      id?: number;
    };
  }): Promise<Car[]> {
    let queryResponse = 'SELECT * FROM car';
    if (where) {
      queryResponse += ' WHERE ';
      const whereArray = [];
      if (where.id) {
        whereArray.push(`id=${where.id}`);
      }
      queryResponse += whereArray.join(' AND ');
    }

    const query = await this.pgClient.query<Car>(queryResponse);
    this.log(query);

    return query.rows;
  }

  async selectRental({
    where,
    eager = true,
  }: {
    where?: {
      id?: number;
      car_id?: number;
      start_date?: Date;
      end_date?: Date;
    };
    eager?: boolean;
  }): Promise<Rent[]> {
    let queryResponse = 'SELECT * FROM rental';
    if (where) {
      queryResponse += ' WHERE ';
      const whereArray = [];
      if (where.id) {
        whereArray.push(`id=${where.id}`);
      }
      if (where.car_id) {
        whereArray.push(`car_id=${where.car_id}`);
      }
      if (where.start_date) {
        whereArray.push(`start_date>=${where.start_date}`);
      }
      if (where.end_date) {
        whereArray.push(`end_date<=${where.end_date}`);
      }
      queryResponse += whereArray.join(' AND ');
    }

    const query = await this.pgClient.query<Rent>(queryResponse);
    this.log(query);

    if (eager) {
      const rents: Rent[] = [];
      for (const rent of query.rows) {
        rents.push({
          ...rent,
          car: (await this.selectCars({ where: { id: rent.car_id } }))[0],
        });
      }

      return rents;
    }

    return query.rows;
  }
}
