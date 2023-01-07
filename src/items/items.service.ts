import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
   * @returns Promise<Item>
   */
  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput);
    return await this.itemsRepository.save(newItem);
  }

  /**
   * Method to get all the items.
   * @returns Promise<Item[]>
   */
  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  /**
   * Method to get one item by id.
   * @param {string} id
   * @returns Promise<Item>
   */
  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);
    return item;
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
