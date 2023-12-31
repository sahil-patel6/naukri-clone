import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserVerifiedListener } from './events/listeners/user-verified-listener';
const start = async () => {
  console.log("Starting up...")
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not found')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not found')
  }
  // NATS
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID not found')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL not found')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID not found')
  }
  // CLOUDINARY
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME not found')
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY not found')
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET not found')
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
    new UserCreatedListener(natsWrapper.client).listen();
    new UserVerifiedListener(natsWrapper.client).listen();
    
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to mongodb")
  } catch (err) {
    console.log(err)
  }

  app.listen(3000, () => {
    console.log('Profile Service listening on port 3000')
  })
}

start();
