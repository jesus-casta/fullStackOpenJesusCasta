const assert = require('node:assert')
const { after, beforeEach, describe, test } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
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

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with status code 400 if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: helper.initialUser.username,
      name: 'Duplicate user',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with status code 400 if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'ml',
      name: 'Short username',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with status code 400 if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'validuser',
      name: 'Short password',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('password must be at least 3 characters long'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('users are returned without password hashes', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body[0].passwordHash, undefined)
  })
})

after(async () => {
  await mongoose.connection.close()
})
