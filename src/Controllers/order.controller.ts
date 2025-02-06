import { Request, Response } from 'express';
import { Order } from '../Entities/Order';
import { User } from '../Entities/User';
import { OrderItem } from '../Entities/OrderItem';
import { orm } from '..';

export const addOrderWithItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const { userId, name, status } = req.body;

    if (!userId || !name || !status) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const user = await em.findOne(User, { id: userId });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const orderItems = await em.find(OrderItem, { userId });

    if (orderItems.length === 0) {
      res.status(404).json({ message: 'No order items found for this user' });
      return;
    }

    const order = new Order();
    order.name = name;
    order.statut = status;
    order.createdAt = new Date();
    order.updateAt = new Date();
    order.user = user;
    order.orderItems = orderItems;

    await em.persistAndFlush(order);

    await em.nativeDelete(OrderItem, { userId });

    res.status(201).json({ message: 'Order created successfully and order items cleared', order });
  } catch (err) {
    console.error('Error creating order with items:', err);
    res.status(500).json({ message: 'Error creating order with items' });
  }
};


export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const orders = await em.find(Order, {}, { populate: ['user', 'orderItems'] });

    if (orders.length === 0) {
      res.status(404).json({ message: 'No orders found' });
      return;
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ message: 'Error retrieving orders' });
  }
};


export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const orders = await em.find(Order, { user: userId }, { populate: ['user', 'orderItems'] });

    if (orders.length === 0) {
      res.status(404).json({ message: 'No orders found for this user' });
      return;
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error retrieving user orders:', err);
    res.status(500).json({ message: 'Error retrieving user orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const orderId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(orderId) || !status) {
      res.status(400).json({ message: 'Invalid order ID or status' });
      return;
    }

    const order = await em.findOne(Order, { id: orderId });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.statut = status;
    order.updateAt = new Date();

    await em.persistAndFlush(order);

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Error updating order status' });
  }
};
