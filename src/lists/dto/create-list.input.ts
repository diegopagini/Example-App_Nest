import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateListInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
