import { Request, Response } from 'express';
import { Order } from '../Entities/Order';
import { User } from '../Entities/User';
import { orm } from '..';

export const addOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const { name, statut, userId } = req.body;

    if (!name || !statut || !userId) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const user = await em.findOne(User, { id: userId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const order = new Order();
    order.name = name;
    order.statut = statut;
    order.createdAt = new Date();
    order.updateAt = new Date();
    order.user = user;

    await em.persistAndFlush(order);

    res.status(201).json({ message: 'Order added successfully', order });
  } catch (err) {
    console.error('Error adding order:', err);
    res.status(500).json({ message: 'Error adding order' });
  }
};