import { currentUser, requireAuth, } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
const router = express.Router();

router.get("/api/profile/recruiter-profile/",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.recruiterProfile) {
      throw new Error('Something went wrong')
    }

    res.send(req.recruiterProfile);

  }
)

export {
  router as viewCandidateProfileRouter
}