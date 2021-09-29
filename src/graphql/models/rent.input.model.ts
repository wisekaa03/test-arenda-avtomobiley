import { InputType, Field } from '@nestjs/graphql';
import { CarInput } from './car.input.model';
import { Tariff } from './enums.model';

@InputType()
export class RentInput {
  @Field(() => CarInput, { description: 'Автомобиль' })
  car: CarInput;

  @Field(() => Tariff, { description: 'Тариф' })
  tariff: Tariff;

  @Field(() => Date, { description: 'С какой даты планируется сдача авто' })
  start_date: Date;

  @Field(() => Date, { description: 'По какоу дату планируется сдача авто' })
  end_date: Date;
}
