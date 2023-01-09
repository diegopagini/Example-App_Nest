import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { SignupInput } from './dto/inputs/signup.input';
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
}
