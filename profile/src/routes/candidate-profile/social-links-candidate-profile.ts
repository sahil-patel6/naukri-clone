import { currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { natsWrapper } from "../../nats-wrapper";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.post("/api/profile/candidate-profile/social-links",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  [
    body('instagram').optional().isURL().contains('instagram').withMessage("instagram should be a valid instagram url"), 
    body('facebook').optional().isURL().contains('facebook').withMessage("facebook should be a valid facebook url"),
    body('twitter').optional().isURL().contains('twitter').withMessage("twitter should be a valid twitter url"),
    body('linkedin').optional().isURL().contains('linkedin').withMessage("linkedin should be a linkedin valid url"),
    body('github').optional().isURL().contains('github').withMessage("github should be a github valid url"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.social_links = { ...req.candidateProfile.social_links,...req.body};

    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      social_links: req.candidateProfile.social_links
    })

    res.send(req.candidateProfile);

  }
)

export {
  router as socialLinksCandidateProfileRouter
}