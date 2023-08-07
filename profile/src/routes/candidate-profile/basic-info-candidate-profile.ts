import { UserRole, currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { upload } from '../../middlewares/multer';
import { natsWrapper } from "../../nats-wrapper";
import { UserUpdatedPublisher } from "../../events/publishers/user-updated-publisher";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.post("/api/profile/candidate-profile/basic-info",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  upload.fields([{ name: 'profile_image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]),
  [
    body('name').isLength({ min: 3 }).withMessage("Name should contain atleast 3 characters"),
    body('email').isEmail().withMessage("Email must be valid"),
    body('phone_number').isMobilePhone('en-IN').withMessage("Phone number must be valid"),
    body('bio').isString().withMessage('Bio cannot be empty'),
    body('dob').isISO8601().withMessage('DOB cannot be empty'),
    body('gender').isIn(['Male', 'Female', 'Others']).withMessage('Company Website cannot be empty'),
    body('current_location').isString().withMessage('Current Location cannot be empty'),
    body('preferred_work_location').isString().withMessage('Preferred Work Location cannot be empty'),
    body('key_skills').isString().withMessage('Key Skills cannot be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    //@ts-ignore
    const profileImagePath = req.files && req.files['profile_image'] ? req.files['profile_image'][0].path : null;
    // @ts-ignore
    const resumePath = req.files && req.files['resume'] ? req.files['resume'][0].path : null;
    console.log(profileImagePath, resumePath);

    req.candidateProfile.name = req.body.name;
    req.candidateProfile.email = req.body.email;
    req.candidateProfile.phone_number = req.body.phone_number;
    req.candidateProfile.profile_image = profileImagePath != null ? profileImagePath : req.candidateProfile.profile_image;
    req.candidateProfile.resume = resumePath != null ? resumePath : req.candidateProfile.resume;
    req.candidateProfile.bio = req.body.bio;
    req.candidateProfile.dob = new Date(req.body.dob).toISOString();
    req.candidateProfile.gender = req.body.gender;
    req.candidateProfile.current_location = req.body.current_location;
    req.candidateProfile.preferred_work_location = req.body.preferred_work_location;
    req.candidateProfile.key_skills = req.body.key_skills.split(",")

    await req.candidateProfile.save();

    // this publisher is for auth service in case user updates its email or name
    await new UserUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.user_id,
      email: req.candidateProfile.email,
      name: req.candidateProfile.name,
      role: UserRole.CANDIDATE,
    })

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      phone_number: req.candidateProfile.phone_number,
      profile_image: req.candidateProfile.profile_image,
      resume: req.candidateProfile.resume,
      bio: req.candidateProfile.bio,
      gender: req.candidateProfile.gender,
      version: req.candidateProfile.version,
    })    

    res.send(req.candidateProfile);

  }
)

export {
  router as addBasicInfoCandidateProfileRouter
}