import { Request, Response } from 'express';
import { User } from '../Entities/User';
import { orm } from '..';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const { name, email, password, isAdmin } = req.body; 

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.isAdmin = isAdmin || false;
    user.createdAt = new Date();
    user.updateAt = new Date();

    await user.hashPassword();

    await em.persistAndFlush(user);

    res.status(201).json({ message: 'User added successfully', user });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Error adding user' });
  }
};


export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const userId = req.params.id;
    const user = await em.findOne(User, { id: parseInt(userId) });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const users = await em.find(User, {});

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const mikro = await orm;
    const em = mikro.em.fork();

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    const user = await em.findOne(User, { email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Error logging in user' });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('token');
    res.clearCookie('jwt');

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Error logging out user:', err);
    res.status(500).json({ message: 'Error logging out user' });
  }
};

export const isAuth = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return;
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      res.status(200).json({ message: 'Token is valid', decoded });
    } catch (err) {
      console.error('Error verifying token:', err);
      res.status(401).json({ message: 'Invalid token' });
    }
  };