import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';

import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

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
      const newUser = this.usersRepository.create({
        ...signupInput,
        // bcrypt.hashSync(signupInput.password, 10) to encrypt the password before save it on the database.
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBErros(error);
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
   * @param {string} email
   * @returns Promise<User>
   */
  async findOneByEmail(email: string): Promise<User> {
    try {
      return this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErros(error);
    }
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

  /**
   * Method to hanlde the errors.
   * @param {any} error
   * The type never means that all the paths will never return a value.
   * Once it enter this must handle it with an exception and never return anything.
   */
  private handleDBErros(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    // logger is like the console.log, console.error, etc... from Nest.
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
