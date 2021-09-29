import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatisticsByDay {
  @Field(() => String)
  date: string | Date;

  @Field(() => Int)
  car_id: number;
}

@ObjectType()
export class StatisticsByAuto {
  @Field(() => String)
  date: string | Date;
}

@ObjectType()
export class StatisticsByAllAutos {
  @Field(() => String)
  date: string | Date;

  @Field(() => Int)
  car_id: number;
}

export const Statistics = createUnionType({
  name: 'Statistics',
  description: 'Отчёт',
  types: () => [StatisticsByDay, StatisticsByAuto, StatisticsByAllAutos],
});
