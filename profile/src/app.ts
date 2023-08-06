import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { errorHandler, NotFoundError } from '@naukri-clone/common';
import { updateCandidateProfileRouter } from './routes/recruiter-profile/update-recruiter-profile';
import { viewCandidateProfileRouter } from './routes/recruiter-profile/view-recruiter-profile';


const app = express();
app.set('trust proxy', true)
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}))

app.use(updateCandidateProfileRouter)
app.use(viewCandidateProfileRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler);

export { app }