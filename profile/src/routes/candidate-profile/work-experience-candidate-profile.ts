import { BadRequestError, currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body, param } from 'express-validator';
import { natsWrapper } from "../../nats-wrapper";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.post("/api/profile/candidate-profile/work-experience/",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  [
    body('company_name').isLength({ min: 3 }).withMessage("Company Name should not be empty"),
    body('designation').isLength({ min: 3 }).withMessage("Designation should not be empty"),
    body('current_working_status').isBoolean().withMessage("Current Working Status must be a boolean value"),
    body('location').isLength({ min: 3 }).withMessage('Location must not be empty'),
    body('job_description').isLength({ min: 3 }).withMessage('Job Description must not be empty'),
    body('start_date').isISO8601().withMessage('Start date should be valid'),
    body('end_date').if(body('current_working_status').equals('true')).isISO8601().withMessage('End date should be valid'),
    body('notice_period').if(body('current_working_status').equals('false')).isIn(['Serving Notice Period', 'Immediately available', '15 Days', '30 days', 'More than 30 days']).withMessage('Notice Period should be valid')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.work_experiences?.push(req.body);
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      work_experiences: req.candidateProfile.work_experiences
    })

    res.send(req.candidateProfile);

  }
)

router.put("/api/profile/candidate-profile/work-experience/:id",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  param("id").isMongoId().withMessage("Please send a valid id"),
  [
    body('company_name').isLength({ min: 3 }).withMessage("Company Name should not be empty"),
    body('designation').isLength({ min: 3 }).withMessage("Designation should not be empty"),
    body('current_working_status').isBoolean().withMessage("Current Working Status must be a boolean value"),
    body('location').isLength({ min: 3 }).withMessage('Location must not be empty'),
    body('job_description').isLength({ min: 3 }).withMessage('Job Description must not be empty'),
    body('start_date').isISO8601().withMessage('Start date should be valid'),
    body('end_date').if(body('current_working_status').equals('true')).isISO8601().withMessage('End date should be valid'),
    body('notice_period').if(body('current_working_status').equals('false')).isIn(['Serving Notice Period', 'Immediately available', '15 Days', '30 days', 'More than 30 days']).withMessage('Notice Period should be valid')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    const work_experience = req.candidateProfile.work_experiences?.find((w) => w.id === req.params.id)

    if (!work_experience) {
      throw new BadRequestError("Work Experience not found")
    }

    work_experience.company_name = req.body.company_name;
    work_experience.designation = req.body.designation;
    work_experience.location = req.body.location;
    work_experience.current_working_status = req.body.current_working_status;
    work_experience.job_description = req.body.job_description;
    work_experience.start_date = req.body.start_date;
    // only add end_date if current working status is false and it exists in req.body
    if (req.body.end_date && !req.body.current_working_status) {
      work_experience.end_date = req.body.end_date;
    }
    // only add notice_period if current working status is true and it exists in req.body
    if (req.body.notice_period && req.body.current_working_status) {
      work_experience.notice_period = req.body.notice_period;
    }

    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      work_experiences: req.candidateProfile.work_experiences
    })

    res.send(req.candidateProfile);

  }
)

router.delete("/api/profile/candidate-profile/work-experience/:id",
  currentUser,
  requireAuth,
  param('id').isMongoId().withMessage("Please send a valid id"),
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }
    
    const work_experience = req.candidateProfile.work_experiences?.find((w) => w.id === req.params.id)

    if (!work_experience) {
      throw new BadRequestError("Work Experience not found")
    }

    const work_experiences = req.candidateProfile.work_experiences?.filter(work_experience => work_experience.id != req.params.id);
    // @ts-ignore
    req.candidateProfile.work_experiences = work_experiences;
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      work_experiences: req.candidateProfile.work_experiences
    })

    res.send(req.candidateProfile);

  }
)

export {
  router as workExperienceCandidateProfileRouter
}