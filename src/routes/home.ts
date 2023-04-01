import { Router } from 'express';

import * as homeController from '../controllers/home';

const appRouter = Router();

appRouter.get('/', homeController.getAppInfo);

export default appRouter;
