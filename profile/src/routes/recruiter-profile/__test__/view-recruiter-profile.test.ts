import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';


it('fails when not signed in', async () => {
  return request(app)
    .get('/api/profile/recruiter-profile')
    .expect(401);
})


it('gets recruiter profile from db', async () => {

  const { body } = await request(app)
    .get('/api/profile/recruiter-profile')
    .set('Cookie', await signin(UserRole.RECRUITER))
    .expect(200);

})