import { Entity, PrimaryKey, Property, OneToMany, ManyToOne } from '@mikro-orm/core';
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

  @Property({ type: 'json', nullable: true })
  orderItems: any[] = [];

  @ManyToOne(() => User)
  user!: User;
}
