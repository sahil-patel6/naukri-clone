import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';
import { CandidateProfile } from '../../../models/candidate-profile';
import { natsWrapper } from '../../../nats-wrapper';

const education = {
  course: "Blah",
  institute: "description",
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString()
}

it('fails when not signed in', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/education')
    .send(education)
    .expect(401);
})

it('sends 400 when start_date is not valid', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/education')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send({ ...education, start_date: "asfasf" })
    .expect(400);
})

it('adds education to db', async () => {

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/education')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send(education)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.educations![0].course).toBe(education.course)
  expect(candidateProfile.educations![0].institute).toBe(education.institute)
  expect(candidateProfile.educations![0].start_date).toStrictEqual(new Date(education.start_date))
  expect(candidateProfile.educations![0].end_date).toStrictEqual(new Date(education.end_date))

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})


it('updates education to db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/education')
    .set('Cookie', cookie)
    .send(education)
    .expect(200);

  await request(app)
    .put(`/api/profile/candidate-profile/education/${body.educations[0]._id}`)
    .set('Cookie', cookie)
    .send({ ...education, course: "BCA" })
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.educations![0].course).toBe("BCA")
  expect(candidateProfile.educations![0].institute).toBe(education.institute)
  expect(candidateProfile.educations![0].start_date).toStrictEqual(new Date(education.start_date))
  expect(candidateProfile.educations![0].end_date).toStrictEqual(new Date(education.end_date))

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('deletes education from db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/education')
    .set('Cookie', cookie)
    .send(education)
    .expect(200);

  await request(app)
    .delete(`/api/profile/candidate-profile/education/${body.educations[0]._id}`)
    .set('Cookie', cookie)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.educations?.length).toBe(0)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})