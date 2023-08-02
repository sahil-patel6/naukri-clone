import express, { Request, Response } from "express";
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, UserRole } from "../models/user";
import { BadRequestError, validateRequest } from "@naukri-clone/common";
const router = express.Router();

router.post("/api/users/signup",
  [
    body('name').isString().isLength({ min: 3 }).withMessage("Name should contain atleast 3 characters"),
    body('email').isEmail().withMessage("Email must be valid"),
    body('role').isIn(["ADMIN", "CANDIDATE", "RECRUITER"]).withMessage("Role must be a valid role"),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be in range 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { name, email, role, password } = req.body;

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const user = User.build({ name, email, password, role })
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      },
      process.env.JWT_KEY!
    )
    req.session = {
      jwt: userJwt
    }
    res.status(201).json(user)
  }
)

export {
  router as signupRouter
}