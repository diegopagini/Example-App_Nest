import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Method to create a new user.
   * @param {SignupInput} signupInput
   * @returns Promise<AuthResponse>
   */
  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // Create a user
    const user = await this.usersService.create(signupInput);
    // Create a JWT
    const token = 'ABC123';
    return {
      token,
      user,
    };
  }

  /**
   * Method to login a user.
   * @param {LoginInput} loginInput
   * @returns Promise<AuthResponse>
   */
  async login({ email, password }: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(email);
    // crypt.compareSync to compare the password on the body of the request with the password in the database.
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(`Email / Password do not match`);
    }

    const token = 'ABC123';

    return {
      token,
      user,
    };
  }
}
