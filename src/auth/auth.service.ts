import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

import { UsersService } from '../users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Method to create a new user.
   * @param {SignupInput} signupInput
   * @returns Promise<AuthResponse>
   */
  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // Create a user.
    const user = await this.usersService.create(signupInput);
    // Create a JWT.
    const token = this.getJwToken(user.id);

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

    const token = this.getJwToken(user.id);

    return {
      token,
      user,
    };
  }

  /**
   * Method to validate a user.
   * @param {string} id
   * @returns Promise<User>
   */
  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user.isActive)
      throw new UnauthorizedException(`User is inactive, talk with an admin`);

    delete user.password;
    return user;
  }

  /**
   * Method to revalidate the token.
   * @param {User} user
   * @returns AuthResponse
   */
  revalidateToken(user: User): AuthResponse {
    const token = this.getJwToken(user.id);

    return {
      token,
      user,
    };
  }

  /**
   * Method to generate a JWT.
   * @param {string} id
   * @returns string
   */
  private getJwToken(id: string): string {
    return this.jwtService.sign({ id });
  }
}
