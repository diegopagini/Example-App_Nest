import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { List } from './entities/list.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [TypeOrmModule.forFeature([List])],
  exports: [TypeOrmModule, ListsService],
})
export class ListsModule {}
