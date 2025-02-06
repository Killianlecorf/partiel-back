import express from 'express';
import { 
    addUser,
    getAllUsers,
    getUserById,
    loginUser
} from '../Controllers/user.controller';

const router = express.Router();

router.post('/add', addUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.post('/login', loginUser);

export default router;
