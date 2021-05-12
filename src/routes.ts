import { Router } from 'express';
import { AnswerController } from './controllers/answerController';
import { SendMailController } from './controllers/sendMailController';
import { SurveyController } from './controllers/surveyController';
import { UserController } from './controllers/userController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.list);

router.post("/sendMail", sendMailController.send);

router.get("/answer/:value", answerController.send);

export { router };