import { Router } from 'express';

import homeRouter from './home';

const appRouter = Router();
const generalRouter = Router();

generalRouter.use(homeRouter);

export { generalRouter, appRouter };
