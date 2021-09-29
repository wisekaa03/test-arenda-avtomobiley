import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Rent } from './models/rent.model';
import { RentInput } from './models/rent.input.model';
import { Car } from './models/car.model';
import { StatisticsInput } from './models/statistics.input.model';
import { Statistics } from './models/statistics.model';
import { StatisticsBy } from './models/enums.model';
import { format } from 'date-fns';

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
      start_date: format(new Date(rent.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(rent.end_date), 'yyyy-MM-dd'),
      price,
    };
  }

  /**
   * Вывод всех арендованных автомобилей
   *
   * @returns {Rent[]} Арендованные автомобили
   */
  async listRental(start_date?: string, end_date?: string): Promise<Rent[]> {
    return this.dbService.selectRental({ where: { start_date, end_date } });
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
      rental.start_date as Date,
      rental.end_date as Date,
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
  async statistics(
    statistics: StatisticsInput,
  ): Promise<Array<typeof Statistics>> {
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
