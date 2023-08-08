import request from 'supertest';
import { app } from '../../../app';
import { UserRole } from '@naukri-clone/common';
import { CandidateProfile } from '../../../models/candidate-profile';
import { natsWrapper } from '../../../nats-wrapper';

const project = {
  title: "Blah",
  description: "description",
  project_status: false,
}

it('fails when not signed in', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/projects')
    .send(project)
    .expect(401);
})

it('sends 400 when project_status is not valid', async () => {
  return request(app)
    .post('/api/profile/candidate-profile/projects')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send({ ...project, project_status: "asfasf" })
    .expect(400);
})

it('adds project to db', async () => {

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/projects')
    .set('Cookie', await signin(UserRole.CANDIDATE))
    .send(project)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.projects![0].title).toBe(project.title)
  expect(candidateProfile.projects![0].description).toBe(project.description)
  expect(candidateProfile.projects![0].project_status).toStrictEqual(project.project_status)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})


it('updates project to db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/projects')
    .set('Cookie', cookie)
    .send(project)
    .expect(200);

  await request(app)
    .put(`/api/profile/candidate-profile/projects/${body.projects[0]._id}`)
    .set('Cookie', cookie)
    .send({ ...project, project_status: true })
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.projects![0].title).toBe(project.title)
  expect(candidateProfile.projects![0].description).toBe(project.description)
  expect(candidateProfile.projects![0].project_status).toStrictEqual(true)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('deletes project from db', async () => {

  const cookie = await signin(UserRole.CANDIDATE)

  const { body } = await request(app)
    .post('/api/profile/candidate-profile/projects')
    .set('Cookie', cookie)
    .send(project)
    .expect(200);

  await request(app)
    .delete(`/api/profile/candidate-profile/projects/${body.projects[0]._id}`)
    .set('Cookie', cookie)
    .expect(200);

  const candidateProfile = await CandidateProfile.findOne({ email: "blah@blah.com" });

  if (!candidateProfile) {
    throw new Error('candidate profile not found')
  }

  expect(candidateProfile.projects?.length).toBe(0)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})