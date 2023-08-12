import express from "express";
import { currentUser } from "@naukri-clone/common/";
import { User } from "../models/user";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, async (req, res) => {
  const user = await User.findOne({
    email: req.currentUser?.email,
    role: req.currentUser?.role
  })
  if (!user) {
    return res.send({ currentUser: null })
  }
  res.send({ currentUser: { ...req.currentUser, isVerified: user?.isVerified } || null })
})

export {
  router as currentUserRouter
}