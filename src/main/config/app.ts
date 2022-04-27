import express from 'express';
import setupStaticFiles from './static-files';
import setupSwagger from './swagger';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';

const app = express();
setupStaticFiles(app);
setupSwagger(app);
setupMiddlewares(app);
setupRoutes(app);

export default app;
