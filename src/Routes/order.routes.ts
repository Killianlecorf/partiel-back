import { Router } from 'express';
import { addOrder } from '../Controllers/order.controller';

const router = Router();

router.post('/', addOrder);

export default router;