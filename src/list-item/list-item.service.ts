import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListItemInput } from './dto/create-list-item.input';
import { ListItem } from './entities/list-item.entity';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
  ) {}

  /**
   * Method to create a list item.
   * @param {CreateListItemInput} createListItemInput
   * @returns Promise<ListItem>
   */
  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: {
        id: itemId,
      },
      list: {
        id: listId,
      },
    });

    return this.listItemsRepository.save(newListItem);
  }

  // findAll() {
  //   return `This action returns all listItem`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} listItem`;
  // }

  // update(id: number, updateListItemInput: UpdateListItemInput) {
  //   return `This action updates a #${id} listItem`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }
}
