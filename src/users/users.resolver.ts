import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { Item } from 'src/items/entities/item.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ItemsService } from '../items/items.service';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
  ) {}

  /**
   * Method to get all the users.
   * @param {ValidRoles} validRoles
   * @param {User} user
   * @returns Promise<User[]>
   */
  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  /**
   *  Method to get a user.
   * @param {string} id
   * @returns Promise<User>
   */
  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  /**
   * Method to update a user.
   * @param {UpdateUserInput} updateUserInput
   * @param {User} user
   * @returns Promise<User>
   */
  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  /**
   * Method to do a logical deletion.
   * @param {string} id
   * @param {User} adminUser
   * @returns Promise<User>
   */
  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  /**
   * Method to get the total number of the item by the user.
   * @param {User} user
   * @returns Promise<number>
   */
  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemService.itemCountByUser(user);
  }

  /**
   * Method to get the total number of the item by the user.
   * @param {User} user
   * @param {PaginationArgs} paginationArgs
   * @param {SearchArgs} searchArgs
   * @returns Promise<number>
   */
  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemService.findAll(user, paginationArgs, searchArgs);
  }
}
