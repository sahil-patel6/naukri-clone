import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';

const user = {
  name: "test",
  email: "abc@abc.com",
  role: "CANDIDATE",
  password: "password"
}

it('returns 201 on succesful signup', async () => {
  const { body } = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);

  const newUser = await User.findById(body.id);
  expect(newUser?.email).toEqual(user.email)
  expect(newUser?.role).toEqual(user.role)
})

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'abcbc.com', name: "test", password: 'password' })
    .expect(400);
})


it('returns a 400 with invalid role', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'ab@cbc.com', name: "test", role: "asd", password: 'password' })
    .expect(400);
})

it('returns a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'abc@cbc.com', password: 'p' })
    .expect(400);
})

it('returns a 400 with missing email and password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400);
})

it('it doesnt allow duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(400);
})

it("it sets a cookie after succesful signup", async () => {

  const response = await request(app)
    .post('/api/users/signup')
    .send(user)
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined()

})


