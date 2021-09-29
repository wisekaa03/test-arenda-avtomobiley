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

  @Query(() => [Car])
  async listCars(): Promise<Car[]> {
    return this.graphqlService.listCars();
  }

  @Query(() => Rent)
  async calculateLease(@Args('rent') rent: RentInput): Promise<Rent> {
    return this.graphqlService.calculateLease(rent, false);
  }

  @Query(() => [Rent])
  async listRental(): Promise<Rent[]> {
    return this.graphqlService.listRental();
  }

  @Mutation(() => Rent)
  async bookCarRental(@Args('rent') rent: RentInput): Promise<Rent> {
    return this.graphqlService.bookCarRental(rent);
  }

  @Mutation(() => Statistics)
  async statistics(
    @Args('statistics') statistics: StatisticsInput,
  ): Promise<typeof Statistics> {
    return this.graphqlService.statistics(statistics);
  }
}
