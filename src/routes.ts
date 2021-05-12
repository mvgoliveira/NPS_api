import { Router } from 'express';
import { SendMailController } from './controllers/sendMailController';
import { SurveyController } from './controllers/surveyController';
import { UserController } from './controllers/userController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.list);

router.post("/sendMail", sendMailController.send);


export { router };