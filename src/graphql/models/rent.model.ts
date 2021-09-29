import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Car } from './car.model';
import { Tariff } from './enums.model';

@ObjectType()
export class Rent {
  @Field(() => ID, { nullable: true, description: 'ID записи' })
  id?: number;

  @Field(() => Car, { nullable: true, description: 'Аффтамабиль!' })
  car?: Car;
  car_id?: number;

  @Field(() => Tariff, { description: 'Тариф' })
  tariff: Tariff;

  @Field(() => Date, { description: 'Дата начала аренды' })
  start_date: Date;

  @Field(() => Date, { description: 'Дата конца аренды' })
  end_date: Date;

  @Field(() => Int, { description: 'Цена' })
  price: number;
}
