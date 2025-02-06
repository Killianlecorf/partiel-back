import express from 'express';
import { 
    addUser,
    getAllUsers,
    getUserById,
    isAuth,
    loginUser,
    logoutUser
} from '../Controllers/user.controller';
import { decodeToken } from '../Middlewares/decode';

const router = express.Router();

router.post('/add', addUser);
router.get('/user/:id', getUserById);
router.get('/all', getAllUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/isAuth', decodeToken, isAuth);

export default router;
