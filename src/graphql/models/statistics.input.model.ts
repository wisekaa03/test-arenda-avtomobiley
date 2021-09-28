import { InputType, Field } from '@nestjs/graphql';

export enum StatisticsBy {
  day = 'day',
  auto = 'auto',
  allAutos = 'allAutos',
}

@InputType()
export class StatisticsInput {
  @Field(() => StatisticsBy)
  by: StatisticsBy;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;
}
