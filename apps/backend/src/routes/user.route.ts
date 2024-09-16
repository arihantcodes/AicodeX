import { Router } from 'express';
import {
  allUsers,
  registerUser,
  loginUser,
  getCurrentUserProfileByUsername,
  changeCurrentPassword,
  logoutUser,
  refreshAccessToken,
  me
} from '../controllers/signup';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware';

const userRouter = Router();

// Public routes
userRouter.post('/signup', registerUser);
userRouter.post('/signin', loginUser);
userRouter.get('/dashboard/:username', me);
userRouter.post('/refresh-token', refreshAccessToken);


// Protected routes
userRouter.use(verifyJWT); // Apply JWT verification to all routes below

userRouter.get('/logout', logoutUser);
userRouter.get('/profile/:username', getCurrentUserProfileByUsername);
userRouter.post('/change-password', changeCurrentPassword);

// Admin only route
userRouter.get('/all',  allUsers);

export default userRouter;