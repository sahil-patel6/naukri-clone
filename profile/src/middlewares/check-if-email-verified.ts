import { BadRequestError, UserRole } from "@naukri-clone/common"
import { NextFunction, Request, Response } from "express"
import { RecruiterProfile, RecruiterProfileDoc } from "../models/recruiter-profile"
import { CandidateProfile, CandidateProfileDoc } from "../models/candidate-profile";

declare global {
  namespace Express{
    interface Request{
      recruiterProfile? : RecruiterProfileDoc;
      candidateProfile? : CandidateProfileDoc;
    }
  }
}

const checkIfProfileExistsandEmailIsVerified = async (req: Request, res: Response, next: NextFunction) => {

  if (req.currentUser?.role === UserRole.RECRUITER){
    const recruiterProfile = await RecruiterProfile.findOne({
      user_id: req.currentUser.id
    })

    if (!recruiterProfile){
      throw new BadRequestError('Recruiter Profile not found')
    }

    if (!recruiterProfile.isVerified){
      throw new BadRequestError('Please verify your email to proceed')
    }

    req.recruiterProfile = recruiterProfile
    return next();
  }else if (req.currentUser?.role === UserRole.CANDIDATE){
    const candidateProfile = await CandidateProfile.findOne({
      user_id: req.currentUser.id
    })

    if (!candidateProfile){
      throw new BadRequestError('Candidate Profile not found')
    }

    if (!candidateProfile.isVerified){
      throw new BadRequestError('Please verify your email to proceed')
    }

    req.candidateProfile = candidateProfile
    return next();
  }
}

export {
  checkIfProfileExistsandEmailIsVerified
}