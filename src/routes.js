import { Router } from 'express';
import multer from 'multer';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import multerConfig from './config/multer';
import RecoveryPasswordController from './app/controllers/RecoveryPasswordController';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

routes.post('/session', bruteForce.prevent, SessionController.store);
routes.post(
  '/recoverypassword',
  bruteForce.prevent,
  RecoveryPasswordController.store
);
routes.put(
  '/resetpassword',
  bruteForce.prevent,
  RecoveryPasswordController.update
);

routes.use(authMiddleware); // middleware de autenticação. Toda rota a partir daqui requer autenticação

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
