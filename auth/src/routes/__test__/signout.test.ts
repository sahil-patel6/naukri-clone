import request from 'supertest';
import { app } from '../../app';

const user = {
  name: "test",
  email: "abc@abc.com",
  role: "CANDIDATE",
  password: "password"
}

it('clears cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})
