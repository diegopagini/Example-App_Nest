import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

@Module({
  providers: [ListsResolver, ListsService]
})
export class ListsModule {}
