import express, { Request, Response } from "express";
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@naukri-clone/common";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.post("/api/users/signup",
  [
    body('name').isLength({ min: 3 }).withMessage("Name should contain atleast 3 characters"),
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

    await new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    })

    res.status(201).json(user)
  }
)

export {
  router as signupRouter
}