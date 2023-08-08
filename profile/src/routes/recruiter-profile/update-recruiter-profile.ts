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
    body('name').isLength({ min: 3 }).withMessage("Name should contain atleast 3 characters"),
    body('email').isEmail().withMessage("Email must be valid"),
    body('phone_number').isMobilePhone('en-IN').withMessage("Phone number must be valid"),
    body('current_position').isString().withMessage('Current Position cannot be empty'),
    body('company_name').isString().withMessage('Company Name cannot be empty'),
    body('company_website').isString().withMessage('Company Website cannot be empty'),
    body('company_address').isString().withMessage('Company Address cannot be empty'),
    body('company_description').isString().withMessage('Company Description cannot be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.recruiterProfile) {
      throw new Error('Something went wrong')
    }

    //@ts-ignore
    const profileImagePath = req.files && req.files['profile_image'] ? req.files['profile_image'][0].path : null;
    // @ts-ignore
    const companyLogoImagePath = req.files && req.files['company_logo'] ? req.files['company_logo'][0].path : null;
    console.log(profileImagePath, companyLogoImagePath);

    req.recruiterProfile.name = req.body.name;
    req.recruiterProfile.email = req.body.email;
    req.recruiterProfile.phone_number = req.body.phone_number;
    req.recruiterProfile.current_position = req.body.current_position;
    req.recruiterProfile.company_name = req.body.company_name;
    req.recruiterProfile.company_description = req.body.company_description;
    req.recruiterProfile.company_email = req.body.company_email;
    req.recruiterProfile.company_address = req.body.company_address;
    req.recruiterProfile.company_website = req.body.company_website;
    req.recruiterProfile.profile_image = profileImagePath != null ? profileImagePath : req.recruiterProfile.profile_image;
    req.recruiterProfile.company_logo = companyLogoImagePath != null ? companyLogoImagePath : req.recruiterProfile.company_logo;

    await req.recruiterProfile.save();

    // this publisher is for auth service in case user updates its email or name
    await new UserUpdatedPublisher(natsWrapper.client).publish({
      id: req.recruiterProfile.user_id,
      email: req.recruiterProfile.email,
      name: req.recruiterProfile.name,
      role: UserRole.RECRUITER,
    })

    await new RecruiterProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.recruiterProfile.id,
      user_id: req.recruiterProfile.user_id,
      name: req.recruiterProfile.name,
      email: req.recruiterProfile.email,
      phone_number: req.recruiterProfile.phone_number,
      company_name: req.recruiterProfile.company_name,
      company_description: req.recruiterProfile.company_description,
      company_email: req.recruiterProfile.company_email,
      company_address: req.recruiterProfile.company_address,
      company_website: req.recruiterProfile.company_website,
      profile_image: req.recruiterProfile.profile_image,
      company_logo: req.recruiterProfile.company_logo,
      version: req.recruiterProfile.version,
      current_position: req.recruiterProfile.current_position
    })

    res.send(req.recruiterProfile);

  }
)

export {
  router as updateRecruiterProfileRouter
}