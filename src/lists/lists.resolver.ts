import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { User } from 'src/users/entities/user.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { ListsService } from './lists.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  /**
   * Method to create a new list.
   * @param {CreateListInput} createListInput
   * @param {User} user
   * @returns Promise<List>
   */
  @Mutation(() => List, { name: 'createItem' })
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return await this.listsService.create(createListInput, user);
  }

  /**
   * Method to get all the lists.
   * @param {User} user
   * @param {PaginationArgs} pagination
   * @param {SearchArgs} searchArgs
   * @returns Promise<List[]>
   */
  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  /**
   * Method to get one list by id.
   * @param {string} id
   * @param {User} user
   * @returns Promise<List>
   */
  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  /**
   * Method to update a list.
   * @param {UpdateListInput} updateListInput
   * @param {User} user
   * @returns Promise<List>
   */
  @Mutation(() => List, { name: 'updateList' })
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.update(updateListInput, user);
  }

  /**
   * Method to delete a list.
   * @param {string} id
   * @param {User} user
   * @returns Promise<List>
   */
  @Mutation(() => List, { name: 'removeList' })
  async removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }
}
