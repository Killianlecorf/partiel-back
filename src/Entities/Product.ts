import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  description!: string;

  @Property()
  price!: number;

  @Property()
  stockAvailable!: number;

  @Property()
  image!: string;

  @Property()
  createdAt!: Date;

  @Property()
  updateAt!: Date;
}
