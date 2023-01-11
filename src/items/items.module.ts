import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Item } from './entities/item.entity';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  exports: [ItemsService, TypeOrmModule],
  providers: [ItemsResolver, ItemsService],
})
export class ItemsModule {}
