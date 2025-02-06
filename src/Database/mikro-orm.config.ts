import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { config } from 'dotenv';
import { User } from '../Entities/User';
import { Order } from '../Entities/Order';
import { OrderItem } from '../Entities/OrderItem';
import { Product } from '../Entities/Product';

config({
    path: __dirname + '/../.env'
});

export default defineConfig(
    {
        dbName: "partiel",
        user: "postgres",
        password: "azqswx12",
        entities: [User, Order, OrderItem, Product],
        port: 5432,
        extensions: [Migrator],
        migrations: {
            path: __dirname + '/migrations'
        },
    }
)