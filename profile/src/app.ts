import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { errorHandler, NotFoundError } from '@naukri-clone/common';
import { updateRecruiterProfileRouter } from './routes/recruiter-profile/update-recruiter-profile';
import { viewRecruiterProfileRouter } from './routes/recruiter-profile/view-recruiter-profile';
import { addBasicInfoCandidateProfileRouter } from './routes/candidate-profile/basic-info-candidate-profile';
import { viewCandidateProfileRouter } from './routes/candidate-profile/view-candidate-profile';
import { languageCandidateProfileRouter } from './routes/candidate-profile/languages-candidate-profile';
import { socialLinksCandidateProfileRouter } from './routes/candidate-profile/social-links-candidate-profile';
import { workExperienceCandidateProfileRouter } from './routes/candidate-profile/work-experience-candidate-profile';
import { educationCandidateProfileRouter } from './routes/candidate-profile/education-candidate-profile';
import { coursesAndCertificationsCandidateProfileRouter } from './routes/candidate-profile/courses-and-certifications-candidate-profile';
import { projectsCandidateProfileRouter } from './routes/candidate-profile/projects-candidate-profile';
import cors from 'cors';


const app = express();
app.set('trust proxy', true)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
  sameSite: 'none'
}))

app.use(updateRecruiterProfileRouter)
app.use(viewRecruiterProfileRouter)

app.use(viewCandidateProfileRouter);
app.use(addBasicInfoCandidateProfileRouter);
app.use(languageCandidateProfileRouter)
app.use(socialLinksCandidateProfileRouter);
app.use(workExperienceCandidateProfileRouter);
app.use(educationCandidateProfileRouter);
app.use(coursesAndCertificationsCandidateProfileRouter);
app.use(projectsCandidateProfileRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler);

export { app }