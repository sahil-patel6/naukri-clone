import { currentUser, requireAuth, } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
const router = express.Router();

router.get("/api/profile/candidate-profile/",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    res.send(req.candidateProfile);

  }
)

export {
  router as viewCandidateProfileRouter
}