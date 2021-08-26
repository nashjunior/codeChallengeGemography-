import { Router } from 'express';
import LanguagesController from '../controllers/LanguagesController';

const routes = Router();
const languagesController = new LanguagesController();

routes.get('/', languagesController.index);

export default routes;
