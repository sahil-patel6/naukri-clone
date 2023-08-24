import { UserRole, currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { upload } from '../../middlewares/multer';
import { RecruiterProfileUpdatedPublisher } from "../../events/publishers/recruiter-profile-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { UserUpdatedPublisher } from "../../events/publishers/user-updated-publisher";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
const router = express.Router();

router.post("/api/profile/recruiter-profile/",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  upload.fields([{ name: 'profile_image', maxCount: 1 }, { name: 'company_logo', maxCount: 1 }]),
  [
    body('name').optional().isLength({ min: 3 }).withMessage("Name should contain atleast 3 characters"),
    // body('email').isEmail().withMessage("Email must be valid"),
    body('phone_number').optional().isMobilePhone('en-IN').withMessage("Phone number must be valid"),
    body('current_position').optional().isString().withMessage('Current Position cannot be empty'),
    body('company_name').optional().isString().withMessage('Company Name cannot be empty'),
    body('company_website').optional().isString().withMessage('Company Website cannot be empty'),
    body('company_address').optional().isString().withMessage('Company Address cannot be empty'),
    body('company_description').optional().isString().withMessage('Company Description cannot be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.recruiterProfile) {
      throw new Error('Something went wrong')
    }

    //@ts-ignore
    const profileImagePath = req.files && req.files['profile_image'] ? req.files['profile_image'][0].path : req.recruiterProfile.profile_image;
    // @ts-ignore
    const companyLogoImagePath = req.files && req.files['company_logo'] ? req.files['company_logo'][0].path : req.recruiterProfile.company_logo;
    console.log(profileImagePath, companyLogoImagePath);

    req.recruiterProfile.set({
      ...req.recruiterProfile.toJSON(),
      ...req.body,
      profile_image: profileImagePath,
      company_logo: companyLogoImagePath
    })

    await req.recruiterProfile.save();

    console.log(req.recruiterProfile)

    // this publisher is for auth service in case user updates its email or name
    await new UserUpdatedPublisher(natsWrapper.client).publish({
      id: req.recruiterProfile.user_id,
      email: req.recruiterProfile.email,
      name: req.recruiterProfile.name,
      role: UserRole.RECRUITER,
    })
    console.log(req.recruiterProfile.toJSON(), "JSON")
    await new RecruiterProfileUpdatedPublisher(natsWrapper.client).publish(req.recruiterProfile.toJSON())
    res.send(req.recruiterProfile);

  }
)

export {
  router as updateRecruiterProfileRouter
}