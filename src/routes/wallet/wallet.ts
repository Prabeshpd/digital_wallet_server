import { Router } from 'express';

import * as walletController from '../../controllers/wallet';
import authenticate from '../../middlewares/auth';

const walletRouter = Router();

walletRouter.get('/', authenticate, walletController.getWallet);
walletRouter.post('/', authenticate, walletController.createWallet);
walletRouter.post('/verify', authenticate, walletController.verifyWallet);
walletRouter.post('/transfer/verify', authenticate, walletController.verifyTransaction);
walletRouter.post('/transfer', authenticate, walletController.transferBalance);

export default walletRouter;
