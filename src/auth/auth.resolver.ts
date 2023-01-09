import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginInput, SignupInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Method to create a new user.
   * @param {SignupInput} signupInput
   * @returns Promise<AuthResponse>
   */
  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  /**
   * Method to login a user.
   * @param {LoginInput} loginInput
   * @returns Promise<AuthResponse>
   */
  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  //   @Query(() => /** */, { name: 'revalidate' })
  //  async revalidateToken() {
  //     return this.authService.revalidateToken(/** */)
  //   }
}
