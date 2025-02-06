import { Entity, PrimaryKey, Property, OneToMany, ManyToOne } from '@mikro-orm/core';
import { OrderItem } from './OrderItem';
import { User } from './User';

@Entity()
export class Order {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  statut!: string;

  @Property()
  createdAt!: Date;

  @Property()
  updateAt!: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems = new Array<OrderItem>();

  @ManyToOne(() => User)
  user!: User;
}