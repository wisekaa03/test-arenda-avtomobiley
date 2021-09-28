import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Car {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  brand: string;

  @Field(() => String)
  model: string;

  @Field(() => String)
  licenseplate: string;

  @Field(() => String)
  vin: string;
}
