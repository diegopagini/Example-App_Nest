import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class List {
  id: string;

  name: string;

  user;
}
