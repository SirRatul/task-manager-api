const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')


/* beforeEach(async () => {
  // console.log('beforeEach')
  setupDatabase()
}) */

beforeEach(setupDatabase)

/* afterEach(() => {
  console.log('afterEach')
}) */

/* test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Ratul',
        email: 'kahanol994@gotkmail.com',
        password: '1234567'
    }).expect(201)
}) */

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
      name: 'Ratul',
      email: 'kahanol994@gotkmail.com',
      password: '1234567'
  }).expect(201)

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user:{
      name: 'Ratul',
      email: 'kahanol994@gotkmail.com'
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('1234567')
})

/* test('Should login existing user', async () => {
  await request(app).post('/users/login').send({
      email: userOne.email,
      password: userOne.password
  }).expect(201)
}) */

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
      email: userOne.email,
      password: userOne.password
  }).expect(201)
  const user = await User.findById(userOne._id)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
      email: userOne.email,
      password: 'thisisnotmypass'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

/* test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
}) */

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Samsul Islam'
    })
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Samsul Islam')
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Dhaka'
    })
    .expect(404)
})