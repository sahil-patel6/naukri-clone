import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

import { errorHandler, NotFoundError } from '@naukri-clone/common';
import { sendOTPRouter } from './routes/send-otp';
import { verifyOTPRouter } from './routes/verfify-otp';


const app = express();
app.set('trust proxy', true)
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(sendOTPRouter);
app.use(verifyOTPRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler);

export { app }