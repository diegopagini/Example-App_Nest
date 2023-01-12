import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { ItemsService } from '../items/items.service';
import { UsersService } from '../users/users.service';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

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

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * Method to delete all the items and users in the database.
   */
  async deleteDatabase(): Promise<void> {
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
  async loadUsers(): Promise<User> {
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
  async loadItems(user: User): Promise<void> {
    const itemsPromises: Promise<Item>[] = [];

    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }
}
