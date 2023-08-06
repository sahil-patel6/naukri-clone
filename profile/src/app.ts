import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { errorHandler, NotFoundError } from '@naukri-clone/common';
import { updateRecruiterProfileRouter } from './routes/recruiter-profile/update-recruiter-profile';
import { viewRecruiterProfileRouter } from './routes/recruiter-profile/view-recruiter-profile';
import { addBasicInfoCandidateProfileRouter } from './routes/candidate-profile/basic-info-candidate-profile';
import { viewCandidateProfileRouter } from './routes/candidate-profile/view-candidate-profile';
import { languageCandidateProfileRouter } from './routes/candidate-profile/languages-candidate-profile';


const app = express();
app.set('trust proxy', true)
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}))

app.use(updateRecruiterProfileRouter)
app.use(viewRecruiterProfileRouter)

app.use(viewCandidateProfileRouter);
app.use(addBasicInfoCandidateProfileRouter);
app.use(languageCandidateProfileRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler);

export { app }