import request from 'supertest';
import { app } from '../../app';
import { OTP } from '../../models/otp';

it('fails when not authorised', async () => {
  return request(app)
    .post('/api/users/send-otp')
    .send({})
    .expect(401);
})

it('sends otp', async () => {
  const { body } = await request(app)
    .post('/api/users/send-otp')
    .set('Cookie', await signup())
    .send({})
    .expect(200);

  expect(body.message).toBe('OTP sent successfully')
})

it('fails to verify otp by sending wrong otp', async () => {
  const cookie = await signup()
  await request(app)
    .post('/api/users/send-otp')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  const { body } = await request(app)
    .post('/api/users/verify-otp')
    .set('Cookie', cookie)
    .send({ otp: "234423" })
    .expect(400);
  console.log(body, "fails to bery")
  expect(body.errors[0].message).toBe('OTP is either invalid or expired')

})

it('verifies otp', async () => {
  const cookie = await signup()
  await request(app)
    .post('/api/users/send-otp')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  const otp = await OTP.findOne({
    email: "abc@abc.com"
  })
  if (!otp) {
    throw new Error('OTP not found')
  }
  console.log(otp.otp)
  const { body } = await request(app)
    .post('/api/users/verify-otp')
    .set('Cookie', cookie)
    .send({ otp: otp.otp })
    .expect(200);
  console.log(body)

  expect(body.message).toBe('Email verified Successfully')
})