import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signup: () => Promise<string[]>;
}

jest.mock('../nats-wrapper')
jest.mock('../utils/email')

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'
  process.env.EMAIL = 'saurabmia'
  // process.env.EMAIL_APP_PASSWORD = process.env.JWT_KEY
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});

})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});


global.signup = async () => {
  const name = "test"
  const role = "CANDIDATE"
  const email = "abc@abc.com";
  const password = "password";
  const response = await request(app)
    .post('/api/users/signup')
    .send({ name, email, role, password })
    .expect(201)
  const cookie = response.get('Set-Cookie')
  return cookie
}
