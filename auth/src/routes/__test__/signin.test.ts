import request from 'supertest';
import { app } from '../../app';

const user = {
  name: "test",
  email: "abc@abc.com",
  role: "CANDIDATE",
  password: "password"
}

it('fails when email doesnt exists is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'abc@abc.com', password: 'password' })
    .expect(400);
})


it('fails when incoorect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'abc@abc.com', password: 'pasword' })
    .expect(400)
})


it('responds with cookie when valid credentials entered', async () => {
  
  await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'abc@abc.com', password: 'password' })
    .expect(200)

  expect(response.get("Set-Cookie")).toBeDefined();
})