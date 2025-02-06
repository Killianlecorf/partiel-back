import { Router } from 'express';
import { 
    addOrderItem,
    getAllOrderItems,
    getUserOrderItems,
    deleteOrderItem
 } from '../Controllers/orderItem.controller';

const router = Router();

router.post('/', addOrderItem);
router.get('/all', getAllOrderItems);
router.get('/user/:userId', getUserOrderItems);
router.delete('/:id', deleteOrderItem);




export default router;