import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { Product } from './Product';
import { Order } from './Order';

@Entity()
export class OrderItem {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => Order)
  order!: Order;

  @Property()
  quantity!: number;
}