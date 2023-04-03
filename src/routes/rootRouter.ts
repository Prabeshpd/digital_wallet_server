import { Router } from 'express';

import homeRouter from './home';
import userRouter from './user/user';
import authRouter from './auth/auth';
import walletRouter from './wallet/wallet';
import transactionRecordsRouter from './wallet/transactionRecord';

const appRouter = Router();
const generalRouter = Router();

generalRouter.use(homeRouter);
appRouter.use('/users', userRouter);
appRouter.use('/auth', authRouter);
appRouter.use('/wallets', walletRouter);
appRouter.use('/transactions', transactionRecordsRouter);

export { generalRouter, appRouter };
