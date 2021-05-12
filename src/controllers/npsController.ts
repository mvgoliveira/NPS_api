import { getCustomRepository, Not, IsNull } from "typeorm"
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"

class NpsController {
   async  list( req, res ){

      const { survey_id } = req.params;
      const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

      const surveysUsers = await surveysUsersRepository.find({
         survey_id,
         value: Not(IsNull())
      })

      const detractors = surveysUsers.filter(survey => 
         (survey.value <= 6)
      ).length;

      const promoters = surveysUsers.filter(survey => 
         (survey.value <= 10 && survey.value >= 9)
      ).length;

      const nps = (((promoters - detractors) / surveysUsers.length)*100).toFixed(2);

      return res.json({
         detractors,
         promoters,
         nps: Number(nps)
      });
   }
}

export { NpsController }