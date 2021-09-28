import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CarInput {
  @Field({ nullable: true, description: 'ID конкретной машины' })
  id?: number;

  @Field({ nullable: true, description: 'Марка' })
  brand?: string;

  @Field({ nullable: true, description: 'Модель' })
  model?: string;

  @Field({ nullable: true, description: 'Государственный номер' })
  licenseplate?: string;

  @Field({ nullable: true, description: 'VIN' })
  vin?: string;
}
