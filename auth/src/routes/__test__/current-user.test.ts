import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {

  const cookie = await global.signup();

  const response = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200)

  expect(response.body.currentUser.email).toEqual("abc@abc.com")
  expect(response.body.currentUser.name).toEqual("test")
})

it('responds with null if not authenticated', async () => {

  const response = await request(app)
    .get("/api/users/currentUser")
    .send()
    .expect(200)

  expect(response.body.currentUser).toBeNull()
})