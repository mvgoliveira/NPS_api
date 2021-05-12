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

      const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
         where: {user_id: user.id},
         relations: ["user", "survey"]
      })

      const variables = {
         name: user.name, 
         title: survey.title, 
         description: survey.description,
         id: "",
         link: process.env.URL_MAIL
      }

      const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

      if (surveyUserAlreadyExists) {
         if (surveyUserAlreadyExists.value !== null) {
            return res.status(401).json({ error: "Survey as already answer" });
         }

         variables.id = surveyUserAlreadyExists.id;
         await SendMailService.send(email, survey.title, variables, npsPath);
         return res.json(surveyUserAlreadyExists);
      }
      
      //salvar informações na tabela
      const surveyUser = surveysUsersRepository.create({
         user_id: user.id,
         survey_id
      })
      
      await surveysUsersRepository.save(surveyUser);

      variables.id = surveyUser.id;

      await SendMailService.send(email, survey.title, variables, npsPath);
      
      return res.json(surveyUser);
   }
}

export { SendMailController }