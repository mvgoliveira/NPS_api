import { Router } from 'express';
import { AnswerController } from './controllers/answerController';
import { NpsController } from './controllers/npsController';
import { SendMailController } from './controllers/sendMailController';
import { SurveyController } from './controllers/surveyController';
import { UserController } from './controllers/userController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.list);

router.post("/sendMail", sendMailController.send);

router.get("/answer/:value", answerController.send);

router.get("/nps/:survey_id", npsController.list);

export { router };