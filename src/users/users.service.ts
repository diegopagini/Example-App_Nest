import { Injectable } from '@nestjs/common';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  /**
   * Method to get all the users.
   * @returns Promise<User[]>
   */
  async findAll(): Promise<User[]> {
    return [];
  }

  /**
   * Method to get a user.
   * @param {string} id
   * @returns Promise<User>
   */
  async findOne(id: string): Promise<User> {
    return;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  /**
   * Method to do a logical deletion.
   * @param {string} id
   * @returns Promise<User>
   */
  async block(id: string): Promise<User> {
    return;
  }
}
