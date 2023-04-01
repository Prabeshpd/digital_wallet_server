import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import * as bodyParser from 'body-parser';

import { disconnect } from './utils/redis';
import { generalRouter, appRouter } from './routes/rootRouter';
import * as errorHandlerMiddleware from './middlewares/errorHandler';
import { initRedisConnection, bindAppConnection, destroyConnection } from './utils/connectionManager';

const APP_PORT =
  (process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.APP_PORT) || process.env.PORT || '3000';
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

const app = express();

app.set('port', APP_PORT);
app.set('host', APP_HOST);

app.use(compression());
app.use(helmet({ contentSecurityPolicy: true, crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false }));

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(generalRouter);
app.use('/api/v1', appRouter);

app.use(errorHandlerMiddleware.genericErrorHandler);
app.use(errorHandlerMiddleware.emptyBody);
app.use(errorHandlerMiddleware.bodyParser);
app.use(errorHandlerMiddleware.notFoundHandler);

export const server = app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Server started at http://${app.get('host')}:${app.get('port')}`);
});

server.on('listening', async function () {
  await initRedisConnection();
  await bindAppConnection();
});

server.on('close', async function () {
  disconnect();
  await destroyConnection();
});

export default app;
