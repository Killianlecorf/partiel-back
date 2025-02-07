import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { config } from 'dotenv';
import { User } from '../Entities/User';
import { Order } from '../Entities/Order';
import { OrderItem } from '../Entities/OrderItem';
import { Product } from '../Entities/Product';
import dotenv from 'dotenv';

config();
dotenv.config();

export default defineConfig({
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'postgres',
    password: process.env.DB_PASSWORD,
    entities: [User, Order, OrderItem, Product],
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    extensions: [Migrator],
    migrations: {
        path: __dirname + '/migrations',
    },
});
