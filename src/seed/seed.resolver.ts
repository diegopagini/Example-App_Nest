import { Mutation, Resolver } from '@nestjs/graphql';

import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  /**
   * Method to clean and fill the database for TESTS.
   * @returns Promise<boolean>
   */
  @Mutation(() => Boolean, {
    description: 'execute the creation of the database for tests',
    name: 'executeSeed',
  })
  async executeSeed(): Promise<boolean> {
    return this.seedService.executeSeed();
  }
}
