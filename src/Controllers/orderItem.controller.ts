import { Request, Response } from 'express';
import { OrderItem } from '../Entities/OrderItem';
import { Product } from '../Entities/Product';
import { orm } from '..';

export const addOrderItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const { productId, quantity, userId } = req.body;

    if (!productId || !quantity || !userId) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const product = await em.findOne(Product, { id: productId });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const orderItem = new OrderItem();
    orderItem.product = product;
    orderItem.quantity = quantity;
    orderItem.userId = userId;

    await em.persistAndFlush(orderItem);

    res.status(201).json({ message: 'Order item added successfully', orderItem });
  } catch (err) {
    console.error('Error adding order item:', err);
    res.status(500).json({ message: 'Error adding order item' });
  }
};

export const getAllOrderItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const orderItems = await em.find(OrderItem, {});

    if (orderItems.length === 0) {
      res.status(404).json({ message: 'No order items found' });
      return;
    }

    res.status(200).json(orderItems);
  } catch (err) {
    console.error('Error retrieving order items:', err);
    res.status(500).json({ message: 'Error retrieving order items' });
  }
};


export const getUserOrderItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const orderItems = await em.find(OrderItem, { userId }, { populate: ['product'] });

    if (orderItems.length === 0) {
      res.status(404).json({ message: 'No order items found for this user' });
      return;
    }

    res.status(200).json(orderItems);
  } catch (err) {
    console.error('Error retrieving order items:', err);
    res.status(500).json({ message: 'Error retrieving order items' });
  }
};

export const deleteOrderItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const orderItemId = parseInt(req.params.id, 10);

    if (isNaN(orderItemId)) {
      res.status(400).json({ message: 'Invalid order item ID' });
      return;
    }

    const orderItem = await em.findOne(OrderItem, { id: orderItemId });

    if (!orderItem) {
      res.status(404).json({ message: 'Order item not found' });
      return;
    }

    await em.removeAndFlush(orderItem);

    res.status(200).json({ message: 'Order item deleted successfully' });
  } catch (err) {
    console.error('Error deleting order item:', err);
    res.status(500).json({ message: 'Error deleting order item' });
  }
};