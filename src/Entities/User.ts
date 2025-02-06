import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { Order } from './Order';
import bcrypt from 'bcryptjs';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  isAdmin!: boolean;

  @Property()
  createdAt!: Date;

  @Property()
  updateAt!: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders = new Array<Order>();

  @Property()
  password!: string;

  // Hook pour hacher le mot de passe avant de l'enregistrer
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Vérifier si le mot de passe correspond
  async validatePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
