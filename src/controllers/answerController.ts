import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/appError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {

   // http://localhost:3333/answer/1?u=432c9014-eaf0-469e-bce6-ba0febd8fe6d
   async send(req, res) {
      const { value } = req.params;
      const { u } = req.query;

      const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

      const surveyUser = await surveysUsersRepository.findOne({
         id: String(u)
      })

      if (value > 10 || value < 0){
         throw new AppError("Survey value out of scope");
      }

      if (!surveyUser) {
         throw new AppError("Survey does not exists to this user");
      }

      surveyUser.value = Number(value);

      await surveysUsersRepository.save(surveyUser);

      return res.json(surveyUser);
   }
}

export { AnswerController }