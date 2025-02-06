import { Router } from 'express';
import { 
    addOrderItem,
    getAllOrderItems,
    getUserOrderItems,
    deleteOrderItem,
    updateOrderItem
 } from '../Controllers/orderItem.controller';

const router = Router();

router.post('/', addOrderItem);
router.get('/all', getAllOrderItems);
router.get('/user/:userId', getUserOrderItems);
router.delete('/:id', deleteOrderItem);
router.put('/:id', updateOrderItem);





export default router;