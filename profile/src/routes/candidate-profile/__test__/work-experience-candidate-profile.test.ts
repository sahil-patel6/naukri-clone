import request from 'supertest';
import { app } from '../../../app';
import { NoticePeriod, UserRole } from '@naukri-clone/common';
import { CandidateProfile } from '../../../models/candidate-profile';
import { natsWrapper } from '../../../nats-wrapper';

const work_experience = {
  company_name: "Google",
  designation: "SDE - I",
  current_working_status: true,
  location: "Bangalore, Karnataka",
  job_description: "Done SDE stuff",
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
  notice_period: NoticePeriod.DAYS_30,
}

it('fails when not signed in', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/work-experience')
    .send(work_experience)
    .expect(401);
})

it('sends 400 when notice_period is not valid', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/work-experience')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send({ ...work_experience, notice_period: "asfasf" })
    .expect(400);
})

it('adds work experience to db', async () => {

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/work-experience')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send(work_experience)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.work_experiences![0].company_name).toBe(work_experience.company_name)
  expect(candidateProfile.work_experiences![0].designation).toBe(work_experience.designation)
  expect(candidateProfile.work_experiences![0].current_working_status).toBe(work_experience.current_working_status)
  expect(candidateProfile.work_experiences![0].location).toBe(work_experience.location)
  expect(candidateProfile.work_experiences![0].job_description).toBe(work_experience.job_description)
  expect(candidateProfile.work_experiences![0].notice_period).toBe(work_experience.notice_period)
  expect(candidateProfile.work_experiences![0].start_date).toStrictEqual(new Date(work_experience.start_date))
  expect(candidateProfile.work_experiences![0].end_date).toStrictEqual(new Date(work_experience.end_date))

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})


it('updates work experience to db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/work-experience')
    .set('Cookie', cookie)
    .send(work_experience)
    .expect(200);

  const response  = await request(app)
    .put(`/api/profile/candidate-profile/work-experience/${body.work_experiences[0]._id}`)
    .set('Cookie', cookie)
    .send({ ...work_experience, current_working_status: false })
    // .expect(200);
  console.log(response.body)

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }


  expect(candidateProfile.work_experiences![0].company_name).toBe(work_experience.company_name)
  expect(candidateProfile.work_experiences![0].designation).toBe(work_experience.designation)
  expect(candidateProfile.work_experiences![0].current_working_status).toBe(false)
  expect(candidateProfile.work_experiences![0].location).toBe(work_experience.location)
  expect(candidateProfile.work_experiences![0].job_description).toBe(work_experience.job_description)
  expect(candidateProfile.work_experiences![0].notice_period).toBe(work_experience.notice_period)
  expect(candidateProfile.work_experiences![0].start_date).toStrictEqual(new Date(work_experience.start_date))
  expect(candidateProfile.work_experiences![0].end_date).toStrictEqual(new Date(work_experience.end_date))

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('deletes work experience from db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/work-experience')
    .set('Cookie', cookie)
    .send(work_experience)
    .expect(200);

  await request(app)
    .delete(`/api/profile/candidate-profile/work-experience/${body.work_experiences[0]._id}`)
    .set('Cookie', cookie)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.work_experiences?.length).toBe(0)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})