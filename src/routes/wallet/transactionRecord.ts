import { Router } from 'express';

import * as transactionRecordController from '../../controllers/transactionRecord';
import authenticate from '../../middlewares/auth';

const transactionRecordsRouter = Router();

transactionRecordsRouter.get('/', authenticate, transactionRecordController.fetch);

export default transactionRecordsRouter;
