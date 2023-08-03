import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';
const start = async () => {
  console.log("Starting up...")
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not found')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not found')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID not found')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL not found')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID not found')
  }
  if (!process.env.EMAIL) {
    throw new Error('EMAIL not found')
  }
  if (!process.env.CLIENT_ID) {
    throw new Error('CLIENT_ID not found')
  }
  if (!process.env.CLIENT_SECRET) {
    throw new Error('CLIENT_SECRET not found')
  }
  if (!process.env.REFRESH_TOKEN) {
    throw new Error('REFRESH_TOKEN not found')
  }
  try {

    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
    process.on('SIGHUP', () => natsWrapper.client.close());

    // listeners
    new UserUpdatedListener(natsWrapper.client).listen();
    
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to mongodb")
  } catch (err) {
    console.log(err)
  }

  app.listen(3000, () => {
    console.log('Auth Service listening on port 3000')
  })
}

start();
