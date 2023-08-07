import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';

const basic_info = {
  name: "test",
  email: "jayey15550@v1zw.com",
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
    .send({...basic_info,email:"asfasf"})
    .expect(400);
})

it('adds basic-info to db', async () => {
  
  const { body } = await request(app)
    .post('/api/profile/candidate-profile/basic-info')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send(basic_info)
    .expect(200);
    
    expect(body.name).toBe(basic_info.name)
    expect(body.email).toBe(basic_info.email)
    expect(body.phone_number).toBe(basic_info.phone_number)
    expect(body.bio).toBe(basic_info.bio)
    expect(body.dob).toBe(basic_info.dob)
    expect(body.gender).toBe(basic_info.gender)
    expect(body.current_location).toBe(basic_info.current_location)
    expect(body.preferred_work_location).toBe(basic_info.preferred_work_location)
    expect(body.key_skills).toStrictEqual(basic_info.key_skills.split(","))
})