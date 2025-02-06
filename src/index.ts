import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import mikroConfig from './Database/mikro-orm.config';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './Routes/user.routes';
import productRouter from './Routes/product.routes';
import orderRouter from './Routes/order.routes';
import cookieParser from 'cookie-parser';

const app = express();
const port = 5656;

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    'http://localhost:5000'
  ],
  credentials: true
}));

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);


const ormPromise = MikroORM.init(mikroConfig).then(orm => {
  console.log('MikroORM has been successfully initialized.');
  return orm;
}).catch(err => {
  console.error('Error during MikroORM initialization:', err);
  throw err;
});

async function initializeServer() {
  try {
    await ormPromise;
    app.listen(port, () => {
      console.log(`API is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

initializeServer();

export { ormPromise as orm };