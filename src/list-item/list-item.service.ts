import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { List } from 'src/lists/entities/list.entity';
import { Repository } from 'typeorm';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
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

    await this.listItemsRepository.save(newListItem);

    return this.findOne(newListItem.id);
  }

  /**
   * Method to get the items in a list.
   * @param {List} list
   * @param {PaginationArgs} paginationArgs
   * @param {SearchArgs} searchArgs
   * @returns Promise<ListItem[]>
   */
  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search)
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });

    return await queryBuilder.getMany();
  }

  /**
   * Method to get the count of items in the list.
   * @param {List} list
   * @returns Promise<number>
   */
  async countListItemsByList(list: List): Promise<number> {
    return await this.listItemsRepository.count({
      where: {
        list: {
          id: list.id,
        },
      },
    });
  }

  /**
   * Method to get one item by id.
   * @param {string} id
   * @returns Promise<ListItem>
   */
  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id });

    if (!listItem)
      throw new NotFoundException(`List item with id ${id} not found`);

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return this.findOne(id);
  }
}
