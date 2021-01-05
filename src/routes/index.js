import { Router } from 'express';
import multer from 'multer';
import userRouter from './userRouter';
import SessionController from '../app/controllers/SessionController';
import authMiddleware from '../app/middlewares/auth';
import FileController from '../app/controllers/FileController';
import multerConfig from '../config/multer';
import RecoveryPasswordController from '../app/controllers/RecoveryPasswordController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);
routes.put('/session', SessionController.update);
routes.post('/recoverypassword', RecoveryPasswordController.store);
routes.put('/resetpassword', RecoveryPasswordController.update);

routes.use(authMiddleware); // middleware de autenticação. Toda rota a partir daqui requer autenticação

routes.use('/users', userRouter);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
