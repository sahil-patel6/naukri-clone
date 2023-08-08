import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';
import { CandidateProfile } from '../../../models/candidate-profile';
import { natsWrapper } from '../../../nats-wrapper';

const language = {
  language_name: "English",
  proficiency: "Beginner",
  read: true,
  write: true,
  speak: true
}

it('fails when not signed in', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/languages')
    .send(language)
    .expect(401);
})

it('sends 400 when proficiency is not valid', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/languages')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send({ ...language, proficiency: "asfasf" })
    .expect(400);
})

it('adds language to db', async () => {

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/languages')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send(language)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.languages![0].language_name).toBe(language.language_name)
  expect(candidateProfile.languages![0].proficiency).toBe(language.proficiency)
  expect(candidateProfile.languages![0].read).toBe(language.read)
  expect(candidateProfile.languages![0].write).toBe(language.write)
  expect(candidateProfile.languages![0].speak).toBe(language.speak)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})


it('updates language to db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/languages')
    .set('Cookie', cookie)
    .send(language)
    .expect(200);

  await request(app)
    .put(`/api/profile/candidate-profile/languages/${body.languages[0]._id}`)
    .set('Cookie', cookie)
    .send({ ...language, language_name: "Hindi" })
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.languages![0].language_name).toBe("Hindi")
  expect(candidateProfile.languages![0].proficiency).toBe(language.proficiency)
  expect(candidateProfile.languages![0].read).toBe(language.read)
  expect(candidateProfile.languages![0].write).toBe(language.write)
  expect(candidateProfile.languages![0].speak).toBe(language.speak)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('deletes language from db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/languages')
    .set('Cookie', cookie)
    .send(language)
    .expect(200);

  await request(app)
    .delete(`/api/profile/candidate-profile/languages/${body.languages[0]._id}`)
    .set('Cookie', cookie)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.languages?.length).toBe(0)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})