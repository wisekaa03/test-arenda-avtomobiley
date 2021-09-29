import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Аффтабамиль!' })
export class Car {
  @Field(() => ID, { description: 'ID машины' })
  id: number;

  @Field(() => String, { description: 'Марка' })
  brand: string;

  @Field(() => String, { description: 'Модель' })
  model: string;

  @Field(() => String, { description: 'Государственный номер' })
  licenseplate: string;

  @Field(() => String, { description: 'VIN' })
  vin: string;
}
