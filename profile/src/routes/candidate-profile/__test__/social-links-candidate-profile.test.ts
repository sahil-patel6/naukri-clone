import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';
import { CandidateProfile } from '../../../models/candidate-profile';
import { natsWrapper } from '../../../nats-wrapper';

const social_links = {
  facebook: "https://www.facebook.com/blah",
  instagram: "https://www.instagram.com/blah",
  twitter: "https://www.twitter.com/blah",
  linkedin: "https://www.linkedin.com/blah",
  github: "https://www.github.com/blah",
}

it('fails when not signed in', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/social-links')
    .send(social_links)
    .expect(401);
})

it('sends 400 when instgram is not valid url', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/social-links')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send({ ...social_links, instagram: "asfasf" })
    .expect(400);
})

it('adds social-links to db', async () => {

  await request(app)
    .post('/api/profile/candidate-profile/social-links')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send(social_links)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({email:"blah@blah.com"});

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.social_links?.facebook).toBe(social_links.facebook)
  expect(candidateProfile.social_links?.instagram).toBe(social_links.instagram)
  expect(candidateProfile.social_links?.twitter).toBe(social_links.twitter)
  expect(candidateProfile.social_links?.linkedin).toBe(social_links.linkedin)
  expect(candidateProfile.social_links?.github).toBe(social_links.github)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})