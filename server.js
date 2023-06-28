/* Express server */
import express from 'express';
import startServer from './libs/boot';
import addRoutes from './routes';
import addMiddlewares from './libs/middlewares';

const app = express();

addMiddlewares(app);
addRoutes(app);
startServer(app);

export default app;
