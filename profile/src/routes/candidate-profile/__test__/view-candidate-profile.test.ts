import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';


it('fails when not signed in', async () => {
  return request(app)
    .get('/api/profile/candidate-profile')
    .expect(401);
})


it('gets candidate profile from db', async () => {

  const { body } = await request(app)
    .get('/api/profile/candidate-profile')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .expect(200);

})