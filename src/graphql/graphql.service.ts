import { Injectable, NotImplementedException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Rent } from './models/rent.model';
import { Car } from './models/car.model';
import { CarInput } from './models/car.input.model';
import { StatisticsInput } from './models/statistics.input.model';
import { Statistics } from './models/statistics.model';

@Injectable()
export class GraphqlService {
  constructor(private readonly dbService: DbService) {}

  async listCars(): Promise<Car[]> {
    return this.dbService.listCars();
  }

  async calculateLease(car: CarInput): Promise<Rent> {
    throw new NotImplementedException();
  }

  async bookCarRental(car: CarInput): Promise<Rent> {
    throw new NotImplementedException();
  }

  async deleteCarRental(car: CarInput): Promise<Rent> {
    throw new NotImplementedException();
  }

  async statistics(statistics: StatisticsInput): Promise<typeof Statistics> {
    throw new NotImplementedException();
  }
}
