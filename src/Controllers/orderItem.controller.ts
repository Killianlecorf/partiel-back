import { Request, Response } from 'express';
import { OrderItem } from '../Entities/OrderItem';
import { Order } from '../Entities/Order';
import { orm } from '..';

export const addOrderItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const { orderId, productName, quantity } = req.body;

    if (!orderId || !productName || !quantity ) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const order = await em.findOne(Order, { id: orderId });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const orderItem = new OrderItem();
    orderItem.product = productName;
    orderItem.quantity = quantity;
    orderItem.order = order;

    await em.persistAndFlush(orderItem);

    res.status(201).json({ message: 'Order item added successfully', orderItem });
  } catch (err) {
    console.error('Error adding order item:', err);
    res.status(500).json({ message: 'Error adding order item' });
  }
};