import express, {Express} from 'express'
import { useMiddlewares } from './config/use-middlewares';
import { useRoutes } from './config/use-routes';

const app = express();
useMiddlewares(app)
useRoutes(app)
export default app

