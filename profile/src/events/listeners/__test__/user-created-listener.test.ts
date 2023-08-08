import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserCreatedListener } from "../user-created-listener";
import { UserCreatedEvent, UserRole } from "@naukri-clone/common";
import { CandidateProfile } from "../../../models/candidate-profile";

const setup = () => {
  // create an instance of the listener
  const listener = new UserCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: UserCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'concert',
    email: "blah@blah.com",
    isVerified: true,
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

  const { listener, data, msg } = setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure candidateProfile was created
  const user = await CandidateProfile.findOne({ user_id: data.id })
  expect(user).toBeDefined()
  expect(user?.email).toBe(data.email)
  expect(user?.name).toBe(data.name)
})

it('acks the message', async () => {

  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
