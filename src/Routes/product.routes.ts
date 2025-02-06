import { Router } from 'express';
import { 
    addProduct, 
    getAllProducts,
    deleteProduct,
    updateProduct
} from '../Controllers/product.controller';
import { decodeToken } from '../Middlewares/decode';
import { checkAdmin } from '../Middlewares/checkAdmin';


const router = Router();

router.post('/', decodeToken,checkAdmin, addProduct);
router.get('/all', getAllProducts);
router.delete('/:id', decodeToken, checkAdmin, deleteProduct);
router.put('/:id', decodeToken, checkAdmin, updateProduct);

export default router;