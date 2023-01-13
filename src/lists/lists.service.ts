import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
  ) {}

  /**
   * Method to create a new list.
   * @param {CreateListInput} createListInput
   * @param {User} user
   * @returns Promise<List>
   */
  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listsRepository.create({ ...createListInput, user });
    return await this.listsRepository.save(newList);
  }

  /**
   * Method to get all the lists.
   * @param {User} user
   * @param {PaginationArgs} pagination
   * @param {SearchArgs} searchArgs
   * @returns Promise<List[]>
   */
  async findAll(
    user: User,
    pagination: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = pagination;
    const { search } = searchArgs;

    const queryBuilder = this.listsRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  /**
   * Method to get one list by id.
   * @param {string} id
   * @param {User} user
   * @returns Promise<List>
   */
  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listsRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!list) throw new NotFoundException(`List with id: ${id} not found`);

    return list;
  }

  /**
   * Method to update a list.
   * @param {UpdateListInput} updateListInput
   * @param {User} user
   * @returns Promise<List>
   */
  async update(updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(updateListInput.id, user);
    const list = await this.listsRepository.preload(updateListInput);
    if (!list)
      throw new NotFoundException(
        `List with id: ${updateListInput.id} not found`,
      );

    return this.listsRepository.save(list);
  }

  /**
   * Method to delete a list.
   * @param {string} id
   * @param {User} user
   * @returns Promise<List>
   */
  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listsRepository.remove(list);
    return { ...list, id };
  }

  /**
   * Method to get the total number of the lists by the user.
   * @param {User} user
   * @returns Promise<number>
   */
  async listCountByUser(user: User): Promise<number> {
    return await this.listsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
