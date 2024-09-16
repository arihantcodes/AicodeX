import { Router } from 'express';


import { createproject,allprojects, deleteproject } from '../controllers/project';
import { verifyJWT } from '../middleware/authMiddleware';

const projectRouter = Router();

// Public routes
//only authenticated users can access these routes

projectRouter.use(verifyJWT);
projectRouter.route('/createproject').post(createproject);
projectRouter.route('/allprojects').get(allprojects);
projectRouter.route('/deleteproject/:id').delete(deleteproject);

export default projectRouter;