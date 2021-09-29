import { InputType, Field } from '@nestjs/graphql';
import { StatisticsBy } from './enums.model';

@InputType()
export class StatisticsInput {
  @Field(() => StatisticsBy)
  by: StatisticsBy;

  @Field(() => String, { nullable: true })
  start_date?: string;

  @Field(() => String, { nullable: true })
  end_date?: string;
}
