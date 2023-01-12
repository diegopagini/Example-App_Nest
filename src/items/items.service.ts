import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { PaginationArgs } from '../common/dto/args/pagination.args';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  /**
   * Method to create a item in the DB.
   * @param {CreateItemInput} createItemInput
   * @param {User} user
   * @returns Promise<Item>
   */
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user });
    return await this.itemsRepository.save(newItem);
  }

  /**
   * Method to get all the items.
   * @param {User} user
   * @param {PaginationArgs} pagination
   * @returns Promise<Item[]>
   * @see https://typeorm.io/#loading-from-the-database
   */
  async findAll(user: User, pagination: PaginationArgs): Promise<Item[]> {
    const { limit, offset } = pagination;

    return this.itemsRepository.find({
      // SELECT * from items where userId = user.id
      where: {
        user: {
          id: user.id,
        },
      },
      // LIMIT 10
      take: limit,
      skip: offset,
    });
  }

  /**
   * Method to get one item by id.
   * @param {string} id
   * @param {User} user
   * @returns Promise<Item>
   */
  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);

    return item;
  }

  /**
   * Method to update a item.
   * @param {UpdateItemInput} updateItemInput
   * @param {User} user
   * @returns Promise<Item>
   */
  async update(updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(updateItemInput.id, user);
    const item = await this.itemsRepository.preload(updateItemInput);
    if (!item)
      throw new NotFoundException(
        `Item with id: ${updateItemInput.id} not found`,
      );

    return this.itemsRepository.save(item);
  }

  /**
   * Method to delete a item.
   * @param {string} id
   * @param {User} user
   * @returns Promise<Item>
   */
  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);
    return { ...item, id };
  }

  /**
   * Method to get the total number of the item by the user.
   * @param {User} user
   * @returns Promise<number>
   */
  async itemCountByUser(user: User): Promise<number> {
    return await this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
