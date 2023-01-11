import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';

import { ValidRoles } from '../../auth/enums/valid-roles.enum';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
