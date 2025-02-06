import { User } from '../../Entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}