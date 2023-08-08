import { natsWrapper } from "../../../nats-wrapper"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserRole, UserUpdatedEvent } from "@naukri-clone/common";
import { UserUpdatedListener } from "../user-updated-listener";
import { User } from "../../../models/user";

const setup = async () => {
  // create an instance of the listener
  const listener = new UserUpdatedListener(natsWrapper.client)

  const user = User.build({
    email: "blah@blah.com",
    name: "blah",
    role: UserRole.CANDIDATE,
    password: "password"
  })

  await user.save()

  // create a fake data event
  const data: UserUpdatedEvent['data'] = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
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

  // write assertions to make sure User was created
  const user = await User.findById(data.id)
  expect(user).toBeDefined()
  expect(user?.email).toBe(data.email)
  expect(user?.name).toBe(data.name)
})

it('acks the message', async () => {

  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
