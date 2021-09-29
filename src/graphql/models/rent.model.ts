import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Car } from './car.model';
import { Tariff } from './enums.model';

@ObjectType()
export class Rent {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field(() => Car, { nullable: true })
  car?: Car;
  car_id?: number;

  @Field(() => Tariff)
  tariff: Tariff;

  @Field(() => Date)
  start_date: Date;

  @Field(() => Date)
  end_date: Date;

  @Field(() => Int)
  price: number;
}
