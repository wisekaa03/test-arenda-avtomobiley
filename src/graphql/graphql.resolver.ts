import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { Rent } from './models/rent.model';
import { Car } from './models/car.model';
import { RentInput } from './models/rent.input.model';
import { StatisticsInput } from './models/statistics.input.model';
import { Statistics } from './models/statistics.model';

@Resolver()
export class GraphqlResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => [Car], { description: 'Вывод всех автомобилей' })
  async listCars(): Promise<Car[]> {
    return this.graphqlService.listCars();
  }

  @Query(() => Rent, {
    description: 'Расчёт стоимости аренды автомобиля за период',
  })
  async calculateLease(
    @Args('rent', { description: 'Принимаемые параметры для вывода' })
    rent: RentInput,
  ): Promise<Rent> {
    return this.graphqlService.calculateLease(rent, false);
  }

  @Query(() => [Rent], { description: 'Вывод всех сессий' })
  async listRental(
    @Args('start_date', { nullable: true }) start_date?: string,
    @Args('end_date', { nullable: true }) end_date?: string,
  ): Promise<Rent[]> {
    return this.graphqlService.listRental(start_date, end_date);
  }

  @Mutation(() => Rent, { description: 'Создание сессии аренды автомобиля' })
  async bookCarRental(
    @Args('rent', { description: 'Принимаемые параметры для вывода' })
    rent: RentInput,
  ): Promise<Rent> {
    return this.graphqlService.bookCarRental(rent);
  }

  @Mutation(() => [Statistics], {
    description:
      'Сформировать отчёт средней загрузки автомобилей по дням, по каждому авто и по всем автомобилям.',
  })
  async statistics(
    @Args('statistics', { description: 'Принимаемые параметры для отчета' })
    statistics: StatisticsInput,
  ): Promise<Array<typeof Statistics>> {
    return this.graphqlService.statistics(statistics);
  }
}
