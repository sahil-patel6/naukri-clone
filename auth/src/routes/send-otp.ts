import express, { Request, Response } from "express";
import { User } from "../models/user";
import { BadRequestError, currentUser, requireAuth, validateRequest } from "@naukri-clone/common";
import { createEmailBodyForOTP } from "../utils/mail_generator";
import { sendEmail } from "../utils/email";
import { OTP } from "../models/otp";

const router = express.Router();

router.post("/api/users/send-otp",
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {

    const user = await User.findOne({ email: req.currentUser!.email, })
    if (!user) {
      throw new BadRequestError('Invalid Credentials');
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'OTP for email verification',
      html: createEmailBodyForOTP({ name: user.name, otp: otp.toString() }),
    };

    await sendEmail(mailOptions);

    const newOTP = new OTP({
      email: user.email,
      otp: otp.toString(),
    });
    await newOTP.save();

    res.status(200).json({ message: "OTP sent successfully" })
  },
)

export {
  router as sendOTPRouter
}