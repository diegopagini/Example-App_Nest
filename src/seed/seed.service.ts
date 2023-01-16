import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ListItemService } from 'src/list-item/list-item.service';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListsService } from '../lists/lists.service';
import { UsersService } from '../users/users.service';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly itemsService: ItemsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    private readonly listItemService: ListItemService,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private readonly listsService: ListsService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  /**
   * Method to clean and fill the database for TESTS.
   * @returns Promise<boolean>
   */
  async executeSeed(): Promise<boolean> {
    try {
      if (this.isProd)
        throw new UnauthorizedException('We cannot run SEED on Prod');
      // Clean database.
      await this.deleteDatabase();
      // Create users.
      const user = await this.loadUsers();
      // Create items.
      await this.loadItems(user);
      // Create lists.
      const list = await this.loadLists(user);
      // Create List items.
      const items = await this.itemsService.findAll(
        user,
        { limit: 10, offset: 0 },
        {},
      );
      await this.loadListItems(list, items);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * Method to delete all the items, lists and users in the database.
   */
  private async deleteDatabase(): Promise<void> {
    // Delete listsItems.
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    // Delete lists.
    await this.listRepository.createQueryBuilder().delete().where({}).execute();
    // Delete items.
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    // Delete users.
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  /**
   * Method to fill the database with users from SEED.
   * @returns Promise<User>
   */
  private async loadUsers(): Promise<User> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }

    return users[0];
  }

  /**
   * Method to fill the database with items from SEED.
   * @param {User} user
   * @returns Promise<void>
   */
  private async loadItems(user: User): Promise<void> {
    const itemsPromises: Promise<Item>[] = [];

    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }

  /**
   * Method to fill the database with lists.
   * @param {User} user
   * @returns Promise<List>
   */
  private async loadLists(user: User): Promise<List> {
    const lists = [];

    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }

    return lists[0];
  }

  /**
   * Method to fill the database with list items.
   * @param {List} list
   * @returns Promise<void>
   */
  private async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      this.listItemService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
