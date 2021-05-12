import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {

   async send(req: Request, res: Response){
      const { email, survey_id } = req.body;

      const usersRepository = getCustomRepository(UsersRepository);
      const surveysRepository = getCustomRepository(SurveysRepository);
      const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

      const user = await usersRepository.findOne({ email });

      if (!user){
         res.status(400).json({ error: "User does not exists" })
      }

      const survey = await surveysRepository.findOne({ id: survey_id });

      if (!survey){
         res.status(400).json({ error: "survey does not exists" })
      }

      const variables = {
         name: user.name, 
         title: survey.title, 
         description: survey.description,
         user_id: user.id,
         link: process.env.URL_MAIL
      }

      const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

      const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
         where: {user_id: user.id, value: null},
         relations: ["user", "survey"]
      })

      if (surveyUserAlreadyExists) {
         await SendMailService.send(email, survey.title, variables, npsPath);
         return res.json(surveyUserAlreadyExists);
      }
      
      await SendMailService.send(email, survey.title, variables, npsPath);
      
      //salvar informações na tabela
      const surveyUser = surveysUsersRepository.create({
         user_id: user.id,
         survey_id
      })
      
      await surveysUsersRepository.save(surveyUser);
   }
}

export { SendMailController }