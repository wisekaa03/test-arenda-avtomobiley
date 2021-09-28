import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { Rent } from './models/rent.model';
import { Car } from './models/car.model';
import { CarInput } from './models/car.input.model';
import { StatisticsInput } from './models/statistics.input.model';
import { Statistics } from './models/statistics.model';

@Resolver()
export class GraphqlResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => [Car])
  async listCars(): Promise<Car[]> {
    return this.graphqlService.listCars();
  }

  @Query(() => Rent)
  async calculateLease(@Args('car') car: CarInput): Promise<Rent> {
    return this.graphqlService.calculateLease(car);
  }

  @Mutation(() => Rent)
  async bookCarRental(@Args('car') car: CarInput): Promise<Rent> {
    return this.graphqlService.bookCarRental(car);
  }

  @Mutation(() => Rent)
  async deleteCarRental(@Args('car') car: CarInput): Promise<Rent> {
    return this.graphqlService.deleteCarRental(car);
  }

  @Mutation(() => Statistics)
  async statistics(
    @Args('statistics') statistics: StatisticsInput,
  ): Promise<typeof Statistics> {
    return this.graphqlService.statistics(statistics);
  }
}
