import { Request, Response } from 'express';
import { Product } from '../Entities/Product';
import { orm } from '..';

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const { name, description, price, stockAvailable, image } = req.body;

    if (!name || !description || price === undefined || stockAvailable === undefined || !image) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;
    product.stockAvailable = stockAvailable;
    product.image = image;
    product.createdAt = new Date();
    product.updateAt = new Date();

    await em.persistAndFlush(product);

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Error adding product' });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const mikro = await orm;
      const em = mikro.em.fork();
  
      const products = await em.find(Product, {});
  
      res.status(200).json(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Error fetching products' });
    }
  };

  export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const mikro = await orm;
      const em = mikro.em.fork();
  
      const productId = req.params.id;
      const product = await em.findOne(Product, { id: parseInt(productId) });
  
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
  
      await em.removeAndFlush(product);
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ message: 'Error deleting product' });
    }
  };

  export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const mikro = await orm;
      const em = mikro.em.fork();
  
      const productId = req.params.id;
      const { name, description, price, stockAvailable, image } = req.body;
  
      const product = await em.findOne(Product, { id: parseInt(productId) });
  
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
  
      if (name !== undefined) product.name = name;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = price;
      if (stockAvailable !== undefined) product.stockAvailable = stockAvailable;
      if (image !== undefined) product.image = image;
      product.updateAt = new Date();
  
      await em.persistAndFlush(product);
  
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Error updating product' });
    }
  };