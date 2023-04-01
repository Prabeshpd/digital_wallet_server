import { Router } from 'express';

import userSchema from '../../schemas/user';
import { schema } from '../../middlewares/validate';
import * as userController from '../../controllers/user';

const userRouter = Router();

userRouter.post('/', schema(userSchema), userController.createUser);

export default userRouter;
