import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError, currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import { OTP } from "../models/otp";
import { UserVerifiedPublisher } from "../events/publishers/user-verified-publisher";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router();

router.post("/api/users/verify-otp",
  currentUser,
  requireAuth,
  [
    body("otp").isString().withMessage("OTP must be valid")
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { otp } = req.body;

    const user = await User.findOne({ email: req.currentUser!.email })
    if (!user) {
      throw new BadRequestError('Invalid Credentials');
    }

    const otpFromDB = await OTP.findOne({ email: req.currentUser?.email, otp })

    if (!otpFromDB) {
      throw new BadRequestError('OTP is either invalid or expired')
    }

    // updating user data
    user.isVerified = true;
    await user.save();

    await new UserVerifiedPublisher(natsWrapper.client).publish({
      id: user.id,
      role: user.role,
    })

    res.status(200).json({ mesage: "Email verified Successfully" })
  },
)

export {
  router as verifyOTPRouter
}