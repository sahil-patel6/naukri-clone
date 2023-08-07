import { currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body, param } from 'express-validator';
import { natsWrapper } from "../../nats-wrapper";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.post("/api/profile/candidate-profile/education/add",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  [
    body('course').isLength({ min: 3 }).withMessage("Course should not be empty"),
    body('institute').isLength({ min: 3 }).withMessage("Institute should not be empty"),
    body('start_date').isISO8601().withMessage('Start date should be valid'),
    body('end_date').optional().isISO8601().withMessage('Start date should be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.educations?.push(req.body);
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      educations: req.candidateProfile.educations
    })

    res.send(req.candidateProfile);

  }
)

router.put("/api/profile/candidate-profile/education/:id",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  param("id").isMongoId().withMessage("Please send a valid id"),
  [
    body('course').isLength({ min: 3 }).withMessage("Course should not be empty"),
    body('institute').isLength({ min: 3 }).withMessage("Institute should not be empty"),
    body('start_date').isISO8601().withMessage('Start date should be valid'),
    body('end_date').optional().isISO8601().withMessage('Start date should be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    for (let education of req.candidateProfile.educations!) {
      if (education.id == req.params.id) {
        education.course = req.body.course;
        education.institute = req.body.institute;
        education.start_date = req.body.start_date;
        // only add end_date if it exists in req.body
        if (req.body.end_date) {
          education.end_date = req.body.end_date;
        }
        break;
      }
    }

    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      educations: req.candidateProfile.educations
    })

    res.send(req.candidateProfile);

  }
)

router.delete("/api/profile/candidate-profile/education/:id",
  currentUser,
  requireAuth,
  param('id').isMongoId().withMessage("Please send a valid id"),
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    const educations = req.candidateProfile.educations?.filter(education => education.id != req.params.id);
    // @ts-ignore
    req.candidateProfile.educations = educations;
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      educations: req.candidateProfile.educations
    })

    res.send(req.candidateProfile);

  }
)

export {
  router as educationCandidateProfileRouter
}