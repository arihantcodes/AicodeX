import { Router } from 'express';
import { allUsers, getCurrentUser, loginUser, registerUser } from '../controllers/signup';
import authenticateUser from '../middleware/authMiddleware'; // Import your middleware

const userrouter = Router();

userrouter.route('/get').get(allUsers);
userrouter.route('/signup').post(registerUser);
userrouter.route('/signin').post(loginUser);
userrouter.route('/getuser').get(authenticateUser, getCurrentUser); // Protect this route with middleware

export default userrouter;
