import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserRole, UserVerifiedEvent } from "@naukri-clone/common";
import { CandidateProfile } from "../../../models/candidate-profile";
import { UserVerifiedListener } from "../user-verified-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new UserVerifiedListener(natsWrapper.client)

  const candidateProfile = CandidateProfile.build({
    email: "blah@blah.com",
    isVerified: false,
    user_id: new mongoose.Types.ObjectId().toHexString(),
    name: "blah"
  })
  await candidateProfile.save();

  // create a fake data event
  const data: UserVerifiedEvent['data'] = {
    id: candidateProfile.user_id,
    role: UserRole.CANDIDATE
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('creates and saves the user(candidate)', async () => {

  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure candidateProfile has isVerified field to true
  const user = await CandidateProfile.findOne({ user_id: data.id })
  expect(user).toBeDefined()
  expect(user?.isVerified).toBe(true)
})

it('acks the message', async () => {

  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
