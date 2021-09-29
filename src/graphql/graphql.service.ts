import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Rent } from './models/rent.model';
import { RentInput } from './models/rent.input.model';
import { Car } from './models/car.model';
import { StatisticsInput } from './models/statistics.input.model';
import { Statistics } from './models/statistics.model';
import { StatisticsBy } from './models/enums.model';

@Injectable()
export class GraphqlService {
  constructor(private readonly dbService: DbService) {}

  /**
   * Вывод всех автомобилей
   *
   * @returns {Car[]} Автомобили
   */
  async listCars(): Promise<Car[]> {
    return this.dbService.selectCars({});
  }

  /**
   * Расчёт стоимости аренды автомобиля за период
   *
   * @param {RentInput} rent
   * @returns {Rent} Расчет стоимости
   */
  async calculateLease(rent: RentInput, previousRents = true): Promise<Rent> {
    const [price, car] = await this.dbService.returnPriceCar(
      rent,
      previousRents,
    );

    return {
      car,
      tariff: rent.tariff,
      start_date: rent.start_date,
      end_date: rent.end_date,
      price,
    };
  }

  /**
   * Вывод всех арендованных автомобилей
   *
   * @returns {Rent[]} Арендованные автомобили
   */
  async listRental(): Promise<Rent[]> {
    return this.dbService.selectRental({});
  }

  /**
   * Создание сессии аренды автомобиля
   *
   * @returns {Rent} Аренда автомобиля
   */
  async bookCarRental(rent: RentInput): Promise<Rent> {
    const rental = await this.calculateLease(rent);

    const rows = await this.dbService.insertRent(
      rental.car.id,
      rental.tariff,
      rental.start_date,
      rental.end_date,
      rental.price,
    );
    if (!rental) {
      throw new UnprocessableEntityException();
    }

    return {
      ...rows[0],
      car: rental.car,
    };
  }

  /**
   * Вывод отчета
   *
   * @returns {Statistics} Отчет
   */
  async statistics(statistics: StatisticsInput): Promise<typeof Statistics> {
    switch (statistics.by) {
      case StatisticsBy.day:
        return this.dbService.statisticsByDay(statistics);
      case StatisticsBy.auto:
        return this.dbService.statisticsByAuto(statistics);
      case StatisticsBy.allAutos:
      default:
        return this.dbService.statisticsByAllAutos(statistics);
    }
  }
}
