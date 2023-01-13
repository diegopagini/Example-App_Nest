import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsModule } from 'src/lists/lists.module';

import { ItemsModule } from '../items/items.module';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User]), ItemsModule, ListsModule],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
