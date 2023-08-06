import { currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body, query } from 'express-validator';
import { natsWrapper } from "../../nats-wrapper";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.put("/api/profile/recruiter-profile/languages",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  [
    body('languages.*.language_name').isString().withMessage("Language should not be empty"),
    body('languages.*.proficiency').isIn(['Beginner', 'Proficient', 'Expert']).withMessage("Proficiency can only contain ['Beginner', 'Proficient', 'Expert']"),
    body('languages.*.read').isBoolean().withMessage("Read must be a boolean value"),
    body('languages.*.write').isBoolean().withMessage('Write must be a boolean value'),
    body('languages.*.speak').isBoolean().withMessage('Speak must be a boolean value'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.languages = req.body.languages;
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      languages: req.candidateProfile.languages
    })

    res.send(req.candidateProfile);

  }
)

router.delete("/api/profile/recruiter-profile/languages/:id",
  currentUser,
  requireAuth,
  query('id').isMongoId().withMessage("Please send a valid id"),
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.languages?.filter(lan => lan.id != req.params.id);
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      languages: req.candidateProfile.languages
    })

    res.send(req.candidateProfile);

  }
)

export {
  router as updateBasicInfoCandidateProfileRouter
}