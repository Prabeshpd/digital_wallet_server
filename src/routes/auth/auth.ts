import { Router } from 'express';

import loginSchema from '../../schemas/login';
import refreshSchema from '../../schemas/refresh';
import { schema } from '../../middlewares/validate';
import * as authController from '../../controllers/auth';

const authRouter = Router();

authRouter.post('/login', schema(loginSchema), authController.login);
authRouter.post('/refresh', schema(refreshSchema), authController.refresh);

export default authRouter;
