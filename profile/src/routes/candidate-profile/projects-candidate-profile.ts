import { BadRequestError, currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body, param } from 'express-validator';
import { natsWrapper } from "../../nats-wrapper";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.post("/api/profile/candidate-profile/projects",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  [
    body('title').isLength({ min: 3 }).withMessage("Title should not be empty"),
    body('description').isLength({ min: 3 }).withMessage("Description should not be empty"),
    body('project_status').isBoolean().withMessage('Project Status should be boolean value'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.projects?.push(req.body);
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      projects: req.candidateProfile.projects
    })

    res.send(req.candidateProfile);

  }
)

router.put("/api/profile/candidate-profile/projects/:id",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  param("id").isMongoId().withMessage("Please send a valid id"),
  [
    body('title').isLength({ min: 3 }).withMessage("Title should not be empty"),
    body('description').isLength({ min: 3 }).withMessage("Description should not be empty"),
    body('project_status').isBoolean().withMessage('Project Status should be boolean value'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    const project = req.candidateProfile.projects?.find((p) => p.id === req.params.id)

    if (!project) {
      throw new BadRequestError("Project not found")
    }

    project.title = req.body.title;
    project.description = req.body.description;
    project.project_status = req.body.project_status;

    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      projects: req.candidateProfile.projects
    })

    res.send(req.candidateProfile);

  }
)

router.delete("/api/profile/candidate-profile/projects/:id",
  currentUser,
  requireAuth,
  param('id').isMongoId().withMessage("Please send a valid id"),
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    const project = req.candidateProfile.projects?.find((p) => p.id === req.params.id)

    if (!project) {
      throw new BadRequestError("Project not found")
    }

    const projects = req.candidateProfile.projects?.filter(project => project.id != req.params.id);
    // @ts-ignore
    req.candidateProfile.projects = projects;
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      projects: req.candidateProfile.projects
    })

    res.send(req.candidateProfile);

  }
)

export {
  router as projectsCandidateProfileRouter
}