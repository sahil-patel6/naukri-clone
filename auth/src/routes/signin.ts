import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from "@naukri-clone/common";
import { Password } from "../services/password";

const router = express.Router();

router.post("/api/users/signin",
  [
    body('email').isEmail().withMessage("Email must be valid"),
    body('role').isIn(["ADMIN", "CANDIDATE", "RECRUITER"]).withMessage("Role must be a valid role"),
    body('password').trim().notEmpty().withMessage('Password cannot be empty')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, role, password } = req.body;

    const existingUser = await User.findOne({ email, role })
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }
    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials')
    }
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        name: existingUser.name,
        role: existingUser.role,
        email: existingUser.email
      },
      process.env.JWT_KEY!
    )
    req.session = {
      jwt: userJwt
    }
    res.status(200).json(existingUser)
  },
)

export {
  router as signinRouter
}