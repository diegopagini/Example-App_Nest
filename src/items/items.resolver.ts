import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  /**
   * Method to create a item in the DB.
   * @param {CreateItemInput} createItemInput
   * @param {User} user
   * @returns Promise<Item>
   */
  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  /**
   * Method to get all the items.
   * @param {User} user
   * @returns Promise<Item[]>
   * @see https://typeorm.io/#loading-from-the-database
   */
  @Query(() => [Item], { name: 'items' })
  async findAll(@CurrentUser() user: User): Promise<Item[]> {
    return this.itemsService.findAll(user);
  }

  /**
   * Method to get one item by id.
   * @param {string} id
   * @param {User} user
   * @returns Promise<Item>
   */
  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.findOne(id, user);
  }

  /**
   * Method to update a item.
   * @param {UpdateItemInput} updateItemInput
   * @param {User} user
   * @returns Promise<Item>
   */
  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput, user);
  }

  /**
   * Method to delete a item.
   * @param {string} id
   * @param {User} user
   * @returns Promise<Item>
   */
  @Mutation(() => Item)
  removeItem(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.itemsService.remove(id, user);
  }
}
