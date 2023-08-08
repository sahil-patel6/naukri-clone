import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';
import { natsWrapper } from '../../../nats-wrapper';
import { RecruiterProfile } from '../../../models/recruiter-profile';

const recruiter_profile_info = {
  name: "test",
  email: "blah@blah.com",
  phone_number: "9878987678",
  current_position: "HR",
  company_name: "Google",
  company_website: "https://www.google.com",
  company_address: "Silicon Valley",
  company_description: "It's Google Bro...",
}

it('fails when not signed in', async () => {
  return request(app)
    .post('/api/profile/recruiter-profile/')
    .send(recruiter_profile_info)
    .expect(401);
})

it('sends 400 when email is not valid', async () => {
  // basic_info.email = "asnflaksnf"
  return request(app)
    .post('/api/profile/recruiter-profile/')
    .set('Cookie', await signin(UserRole.RECRUITER))
    .send({ ...recruiter_profile_info, email: "asfasf" })
    .expect(400);
})

it('adds recruiter profile info to db', async () => {

  const { body } = await request(app)
    .post('/api/profile/recruiter-profile/')
    .set('Cookie', await signin(UserRole.RECRUITER))
    .send(recruiter_profile_info)
    .expect(200);

  const recruiterProfile = await RecruiterProfile.findById(body.id);

  if (!recruiterProfile) {
    throw new Error('candidate profile not found')
  }

  expect(recruiterProfile.name).toBe(recruiter_profile_info.name)
  expect(recruiterProfile.email).toBe(recruiter_profile_info.email)
  expect(recruiterProfile.phone_number).toBe(recruiter_profile_info.phone_number)
  expect(recruiterProfile.current_position).toBe(recruiter_profile_info.current_position)
  expect(recruiterProfile.company_name).toStrictEqual(recruiter_profile_info.company_name)
  expect(recruiterProfile.company_website).toBe(recruiter_profile_info.company_website)
  expect(recruiterProfile.company_address).toBe(recruiter_profile_info.company_address)
  expect(recruiterProfile.company_description).toBe(recruiter_profile_info.company_description)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})