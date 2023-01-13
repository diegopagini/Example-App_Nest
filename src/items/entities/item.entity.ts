import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ListItem } from '../../list-item/entities/list-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;

  /**
   * @see https://orkhan.gitbook.io/typeorm/docs/indices
   */
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;

  /**
   * @see https://typeorm.io/decorator-reference#unique
   * @see https://wanago.io/2021/08/09/constraints-postgresql-typeorm/
   */
  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Unique('listItem-item', ['list', 'item'])
  @Field(() => [ListItem])
  listItem: ListItem[];
}
