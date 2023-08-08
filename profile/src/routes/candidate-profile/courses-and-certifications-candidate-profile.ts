import { BadRequestError, currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import express, { Request, Response } from "express";
import { body, param } from 'express-validator';
import { natsWrapper } from "../../nats-wrapper";
import { checkIfProfileExistsandEmailIsVerified } from "../../middlewares/check-if-email-verified";
import { CandidateProfileUpdatedPublisher } from "../../events/publishers/candidate-profile-updated-publisher";
const router = express.Router();

router.get("/api/profile/candidate-profile/courses-and-certifications",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    res.send({ courses_and_certifications: req.candidateProfile.courses_and_certifications });

  }
)

router.post("/api/profile/candidate-profile/courses-and-certifications",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  [
    body('name').isLength({ min: 3 }).withMessage("Name should not be empty"),
    body('description').isLength({ min: 3 }).withMessage("Description should not be empty"),
    body('url').isURL().withMessage('URL should be valid'),
    body('issued_by').isLength({ min: 3 }).withMessage("Issued By should not be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    req.candidateProfile.courses_and_certifications?.push(req.body);
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      courses_and_certifications: req.candidateProfile.courses_and_certifications
    })

    res.send({ courses_and_certifications: req.candidateProfile.courses_and_certifications });

  }
)

router.put("/api/profile/candidate-profile/courses-and-certifications/:id",
  currentUser,
  requireAuth,
  checkIfProfileExistsandEmailIsVerified,
  param("id").isMongoId().withMessage("Please send a valid id"),
  [
    body('name').isLength({ min: 3 }).withMessage("Name should not be empty"),
    body('description').isLength({ min: 3 }).withMessage("Description should not be empty"),
    body('url').isURL().withMessage('URL should be valid'),
    body('issued_by').isLength({ min: 3 }).withMessage("Issued By should not be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    const course_and_certificate = req.candidateProfile.courses_and_certifications?.find((c) => c.id === req.params.id)

    if (!course_and_certificate) {
      throw new BadRequestError("Course and Certification not found")
    }

    course_and_certificate.name = req.body.name;
    course_and_certificate.description = req.body.description;
    course_and_certificate.url = req.body.url;
    course_and_certificate.issued_by = req.body.issued_by;

    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      courses_and_certifications: req.candidateProfile.courses_and_certifications
    })

    res.send({ courses_and_certifications: req.candidateProfile.courses_and_certifications });

  }
)

router.delete("/api/profile/candidate-profile/courses-and-certifications/:id",
  currentUser,
  requireAuth,
  param('id').isMongoId().withMessage("Please send a valid id"),
  checkIfProfileExistsandEmailIsVerified,
  async (req: Request, res: Response) => {

    if (!req.candidateProfile) {
      throw new Error('Something went wrong')
    }

    const course_and_certificate = req.candidateProfile.courses_and_certifications?.find((c) => c.id === req.params.id)

    if (!course_and_certificate) {
      throw new BadRequestError("Course and Certification not found")
    }

    const courses_and_certifications = req.candidateProfile.courses_and_certifications?.filter(coruse_and_certificate => coruse_and_certificate.id != req.params.id);
    // @ts-ignore
    req.candidateProfile.courses_and_certifications = courses_and_certifications;
    await req.candidateProfile.save();

    await new CandidateProfileUpdatedPublisher(natsWrapper.client).publish({
      id: req.candidateProfile.id,
      name: req.candidateProfile.name,
      email: req.candidateProfile.email,
      user_id: req.candidateProfile.user_id,
      version: req.candidateProfile.version,
      courses_and_certifications: req.candidateProfile.courses_and_certifications
    })

    res.send({ message: "Course and Certification deleted successfully" });

  }
)

export {
  router as coursesAndCertificationsCandidateProfileRouter
}