import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';

import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Method to create a user.
   * @param {SignupInput} signupInput
   * @returns Promise<User>
   */
  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create(signupInput);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
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
