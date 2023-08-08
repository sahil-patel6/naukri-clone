import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { UserRole } from '@naukri-clone/common';
import { CandidateProfile } from '../models/candidate-profile';
import { RecruiterProfile } from '../models/recruiter-profile';

declare global {
  var signin: (role:UserRole) => Promise<string[]>;
}

jest.mock('../nats-wrapper')

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
  jest.clearAllMocks()
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


global.signin = async (role: UserRole) => {

  let payload = {}

  if (role === UserRole.CANDIDATE){
    const candidateProfile = CandidateProfile.build({
      email: "blah@blah.com",
      name: "test",
      user_id: new mongoose.Types.ObjectId().toHexString(),
      isVerified: true,
    })
    await candidateProfile.save()
    payload = {
      id : candidateProfile.user_id,
      name:candidateProfile.name,
      email: candidateProfile.email,
      role: UserRole.CANDIDATE
    }
  }else{
    const recruiterProfile = RecruiterProfile.build({
      email: "jayey15550@v1zw.com",
      name: "test",
      user_id: new mongoose.Types.ObjectId().toHexString(),
      isVerified: true,
    })
    await recruiterProfile.save()
    payload = {
      id : recruiterProfile.user_id,
      name:recruiterProfile.name,
      email: recruiterProfile.email,
      role: UserRole.RECRUITER
    }
  }

  // Build  a jwt payload. {id,email}

  // const payload = {
  //   id: new mongoose.Types.ObjectId().toHexString(),
  //   email: 'test@test.com'
  // }

  // create the jwt

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build the session object

  const session = { jwt: token }

  // turn that session into json

  const sessionJSON = JSON.stringify(session)

  // take json and encode it as base64

  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string thats the cookie with encoded data.

  return [`session=${base64}`]

}
