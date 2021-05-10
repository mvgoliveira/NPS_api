import { Router } from 'express';
import { SurveyController } from './controllers/surveyController';
import { UserController } from './controllers/userController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.list);


export { router };