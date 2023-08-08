import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';
import { CandidateProfile } from '../../../models/candidate-profile';
import { natsWrapper } from '../../../nats-wrapper';

const course_and_certificate = {
  name: "Blah",
  description: "description",
  url: "https://www.google.com",
  issued_by: "Google"
}

it('fails when not signed in', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/courses-and-certifications')
    .send(course_and_certificate)
    .expect(401);
})

it('sends 400 when url is not valid', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/courses-and-certifications')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send({ ...course_and_certificate, url: "asfasf" })
    .expect(400);
})

it('adds courses and certifications to db', async () => {

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/courses-and-certifications')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send(course_and_certificate)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.courses_and_certifications![0].name).toBe(course_and_certificate.name)
  expect(candidateProfile.courses_and_certifications![0].description).toBe(course_and_certificate.description)
  expect(candidateProfile.courses_and_certifications![0].url).toBe(course_and_certificate.url)
  expect(candidateProfile.courses_and_certifications![0].issued_by).toBe(course_and_certificate.issued_by)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})


it('updates courses and certificate to db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/courses-and-certifications')
    .set('Cookie', cookie)
    .send(course_and_certificate)
    .expect(200);

  await request(app)
    .put(`/api/profile/candidate-profile/courses-and-certifications/${body.courses_and_certifications[0]._id}`)
    .set('Cookie', cookie)
    .send({ ...course_and_certificate, name: "Google IT certificate" })
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.courses_and_certifications![0].name).toBe("Google IT certificate")
  expect(candidateProfile.courses_and_certifications![0].description).toBe(course_and_certificate.description)
  expect(candidateProfile.courses_and_certifications![0].url).toBe(course_and_certificate.url)
  expect(candidateProfile.courses_and_certifications![0].issued_by).toBe(course_and_certificate.issued_by)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('deletes course and certificate from db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/courses-and-certifications')
    .set('Cookie', cookie)
    .send(course_and_certificate)
    .expect(200);

  await request(app)
    .delete(`/api/profile/candidate-profile/courses-and-certifications/${body.courses_and_certifications[0]._id}`)
    .set('Cookie', cookie)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.courses_and_certifications?.length).toBe(0)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})