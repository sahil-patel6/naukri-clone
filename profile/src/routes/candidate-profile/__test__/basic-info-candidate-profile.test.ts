import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';
import { CandidateProfile } from '../../../models/candidate-profile';
import { natsWrapper } from '../../../nats-wrapper';

const basic_info = {
  name: "test",
  email: "blah@blah.com",
  phone_number: "9878987678",
  bio: "I rock",
  dob: "2023-08-06T20:22:02.367Z",
  gender: "Male",
  current_location: "Ponda, Goa",
  preferred_work_location: "Bangalore, Karnataka",
  key_skills: "MongoDB,Express.js,React.js,Node.js",
}

it('fails when not signed in', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/basic-info')
    .send(basic_info)
    .expect(401);
})

it('sends 400 when email is not valid', async () => {
  // basic_info.email = "asnflaksnf"
  return request(app)
    .post('/api/profile/candidate-profile/basic-info')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send({ ...basic_info, email: "asfasf" })
    .expect(400);
})

it('adds basic-info to db', async () => {

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/basic-info')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send(basic_info)
    .expect(200);

  const candidateProfile = await CandidateProfile.findById(body.id);

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.name).toBe(basic_info.name)
  expect(candidateProfile.email).toBe(basic_info.email)
  expect(candidateProfile.phone_number).toBe(basic_info.phone_number)
  expect(candidateProfile.bio).toBe(basic_info.bio)
  expect(candidateProfile.dob).toStrictEqual(new Date(basic_info.dob))
  expect(candidateProfile.gender).toBe(basic_info.gender)
  expect(candidateProfile.current_location).toBe(basic_info.current_location)
  expect(candidateProfile.preferred_work_location).toBe(basic_info.preferred_work_location)
  expect(candidateProfile.key_skills).toStrictEqual(basic_info.key_skills.split(","))
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})