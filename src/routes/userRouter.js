import { Router } from 'express';
import UserController from '../app/controllers/UserController';

const routes = Router();

routes.get('/', UserController.index);
routes.get('/:id', UserController.show);
routes.post('/', UserController.store);
routes.put('/:id', UserController.update);
routes.delete('/:id', UserController.delete);

export default routes;
