import { currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body, oneOf } from 'express-validator';
import { natsWrapper } from "../../nats-wrapper";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.get("/api/profile/candidate-profile/social-links", currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified, async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    res.send({social_links: req.candidateProfile.social_links});

  })

router.post("/api/profile/candidate-profile/social-links",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  [
    oneOf([
      body('instagram').equals(""),
      body('instagram').isURL().contains('instagram')
    ], { message: "instagram should contain a valid url" }),
    oneOf([
      body('facebook').equals(""),
      body('facebook').isURL().contains('facebook')
    ], { message: "facebook should contain a valid url" }),
    oneOf([
      body('twitter').equals(""),
      body('twitter').isURL().contains('twitter')
    ], { message: "twitter should contain a valid url" }),
    oneOf([
      body('linkedin').equals(""),
      body('linkedin').isURL().contains('linkedin')
    ], { message: "linkedin should contain a valid url" }),
    oneOf([
      body('github').equals(""),
      body('github').isURL().contains('github')
    ], { message: "github should contain a valid url" }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.social_links = { ...req.candidateProfile.social_links, ...req.body };

    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      social_links: req.candidateProfile.social_links
    })

    res.send({social_links: req.candidateProfile.social_links});

  }
)

export {
  router as socialLinksCandidateProfileRouter
}