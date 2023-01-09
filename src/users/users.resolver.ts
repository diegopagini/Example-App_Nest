import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Method to get all the users.
   * @returns Promise<User[]>
   */
  @Query(() => [User], { name: 'users' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   *  Method to get a user.
   * @param {string} id
   * @returns Promise<User>
   */
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return;
  }

  /**
   * Method to do a logical deletion.
   * @param {string} id
   * @returns Promise<User>
   */
  @Mutation(() => User)
  blockUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.block(id);
  }
}
