const assert = require('node:assert')
const { after, beforeEach, describe, test } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

const initializeUserAndBlogs = async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await api
    .post('/api/users')
    .send(helper.initialUser)

  const users = await helper.usersInDb()
  const user = users[0]

  const blogObjects = helper.initialBlogs.map((blog) => {
    return new Blog({
      ...blog,
      user: user.id,
    })
  })

  const savedBlogs = await Promise.all(blogObjects.map((blog) => blog.save()))
  await User.findByIdAndUpdate(user.id, {
    blogs: savedBlogs.map((blog) => blog._id),
  })
}

const getAuthorizationHeader = async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: helper.initialUser.username,
      password: helper.initialUser.password,
    })

  return `Bearer ${response.body.token}`
}

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await initializeUserAndBlogs()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
  })
})

describe('addition of a new blog', () => {
  beforeEach(async () => {
    await initializeUserAndBlogs()
  })

  test('succeeds with valid data', async () => {
    const authorization = await getAuthorizationHeader()
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes('Canonical string reduction'))
  })

  test('defaults likes to zero if likes is missing', async () => {
    const authorization = await getAuthorizationHeader()
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status code 400 if title is missing', async () => {
    const authorization = await getAuthorizationHeader()
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 400 if url is missing', async () => {
    const authorization = await getAuthorizationHeader()
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await initializeUserAndBlogs()
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const authorization = await getAuthorizationHeader()
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', authorization)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map((blog) => blog.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('fails with status code 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 403 if user is not the creator', async () => {
    const otherUser = {
      username: 'otheruser',
      name: 'Other User',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(otherUser)

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: otherUser.username,
        password: otherUser.password,
      })

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  beforeEach(async () => {
    await initializeUserAndBlogs()
  })

  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

    const blogsAtEnd = await helper.blogsInDb()
    const changedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)

    assert.strictEqual(changedBlog.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
