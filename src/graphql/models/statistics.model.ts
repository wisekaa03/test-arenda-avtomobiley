import { createUnionType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StatisticsByDay {
  @Field()
  what: string;
}

@ObjectType()
export class StatisticsByAuto {
  @Field()
  what: string;
}

@ObjectType()
export class StatisticsByAllAutos {
  @Field()
  what: string;
}

export const Statistics = createUnionType({
  name: 'Statistics',
  types: () => [StatisticsByDay, StatisticsByAuto, StatisticsByAllAutos],
});
