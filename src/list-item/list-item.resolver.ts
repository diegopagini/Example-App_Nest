import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { ListItemService } from './list-item.service';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  /**
   * Method to create a list item.
   * @param {CreateListItemInput} createListItemInput
   * @returns Promise<ListItem>
   */
  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  /**
   * Method to get one item by id.
   * @param {string} id
   * @returns Promise<ListItem>
   */
  @Query(() => ListItem, { name: 'listItem' })
  async findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem)
  async updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    return this.listItemService.update(
      updateListItemInput.id,
      updateListItemInput,
    );
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
