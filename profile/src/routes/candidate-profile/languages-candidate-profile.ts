import { BadRequestError, currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body, param } from 'express-validator';
import { natsWrapper } from "../../nats-wrapper";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.get("/api/profile/candidate-profile/languages",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    res.send({ languages: req.candidateProfile.languages });

  })

router.post("/api/profile/candidate-profile/languages",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  [
    body('language_name').isString().withMessage("Language should not be empty"),
    body('proficiency').isIn(['Beginner', 'Proficient', 'Expert']).withMessage("Proficiency can only contain ['Beginner', 'Proficient', 'Expert']"),
    body('read').isBoolean().withMessage("Read must be a boolean value"),
    body('write').isBoolean().withMessage('Write must be a boolean value'),
    body('speak').isBoolean().withMessage('Speak must be a boolean value'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.languages?.push(req.body);
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      languages: req.candidateProfile.languages
    })

    res.send({ languages: req.candidateProfile.languages });

  }
)

router.put("/api/profile/candidate-profile/languages/:id",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  param("id").isMongoId().withMessage("Please send a valid id"),
  [
    body('language_name').isString().withMessage("Language should not be empty"),
    body('proficiency').isIn(['Beginner', 'Proficient', 'Expert']).withMessage("Proficiency can only contain ['Beginner', 'Proficient', 'Expert']"),
    body('read').isBoolean().withMessage("Read must be a boolean value"),
    body('write').isBoolean().withMessage('Write must be a boolean value'),
    body('speak').isBoolean().withMessage('Speak must be a boolean value'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    const language = req.candidateProfile.languages?.find((l) => l.id === req.params.id)

    if (!language) {
      throw new BadRequestError("Language not found")
    }

    language.language_name = req.body.language_name;
    language.proficiency = req.body.proficiency;
    language.read = req.body.read;
    language.write = req.body.write;
    language.speak = req.body.speak;

    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      languages: req.candidateProfile.languages
    })

    res.send({ languages: req.candidateProfile.languages });

  }
)

router.delete("/api/profile/candidate-profile/languages/:id",
  currentUser,
  requireAuth,
  param('id').isMongoId().withMessage("Please send a valid id"),
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    const language = req.candidateProfile.languages?.find((l) => l.id === req.params.id)

    if (!language) {
      throw new BadRequestError("Language not found")
    }

    const languages = req.candidateProfile.languages?.filter(lan => lan.id != req.params.id);
    // @ts-ignore
    req.candidateProfile.languages = languages;
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      languages: req.candidateProfile.languages
    })

    res.send({message: "Language deleted successfully"});

  }
)

export {
  router as languageCandidateProfileRouter
}