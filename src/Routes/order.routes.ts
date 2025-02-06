import { Router } from 'express';
import { 
    addOrderWithItems,
    getAllOrders,
    getUserOrders,
    updateOrderStatus
} from '../Controllers/order.controller';

const router = Router();

router.post('/add', addOrderWithItems);
router.get('/all', getAllOrders);
router.get('/user/:userId', getUserOrders);
router.put('/status/:id', updateOrderStatus);



export default router;