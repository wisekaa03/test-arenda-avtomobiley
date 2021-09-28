import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Car } from './car.model';

@ObjectType()
export class Rent {
  @Field(() => ID)
  id: number;

  @Field(() => Car)
  car: Car;

  @Field(() => Date)
  dateStart: Date;

  @Field(() => Date)
  dateEnd: Date;

  @Field(() => Int)
  price: number;
}
