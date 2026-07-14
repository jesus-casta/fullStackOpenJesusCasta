const assert = require('node:assert')
const { after, beforeEach, describe, test } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)
    const user = new User({
      username: helper.initialUser.username,
      name: helper.initialUser.name,
      passwordHash,
    })

    await user.save()
  })

  test('succeeds with valid credentials', async () => {
    const result = await api
      .post('/api/login')
      .send({
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(result.body.token)
    assert.strictEqual(result.body.username, helper.initialUser.username)
  })

  test('fails with status code 401 if password is invalid', async () => {
    const result = await api
      .post('/api/login')
      .send({
        username: helper.initialUser.username,
        password: 'wrongpassword',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
