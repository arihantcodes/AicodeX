import { Router } from 'express';
import {
  allUsers,
  registerUser,
  loginUser,
  getCurrentUserProfileByUsername,
  changeCurrentPassword,
  logoutUser,
  refreshAccessToken,
  me,
  usernameandpasswordchange
} from '../controllers/signup';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware';

const userRouter = Router();

// Public routes
userRouter.post('/signup', registerUser);
userRouter.post('/signin', loginUser);

userRouter.post('/refresh-token', refreshAccessToken);


// Protected routes
userRouter.use(verifyJWT); // Apply JWT verification to all routes below
userRouter.get('/dashboard/:username', me);
userRouter.get('/logout', logoutUser);
userRouter.get('/profile/:username', getCurrentUserProfileByUsername);
userRouter.post('/change-password', changeCurrentPassword);
userRouter.post('/update-profile', usernameandpasswordchange);
// Admin only route
userRouter.get('/all',  allUsers);

export default userRouter;