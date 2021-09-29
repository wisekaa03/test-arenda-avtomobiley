import { InputType, Field } from '@nestjs/graphql';
import { StatisticsBy } from './enums.model';

@InputType()
export class StatisticsInput {
  @Field(() => StatisticsBy)
  by: StatisticsBy;

  @Field(() => Date, { nullable: true })
  start?: Date;

  @Field(() => Date, { nullable: true })
  end?: Date;
}
