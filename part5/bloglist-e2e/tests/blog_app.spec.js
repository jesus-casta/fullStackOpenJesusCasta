const { test, expect, beforeEach, describe } = require('@playwright/test')

const backendUrl = 'http://127.0.0.1:3003'

const user = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen',
}

const anotherUser = {
  username: 'root',
  name: 'Superuser',
  password: 'sekret',
}

const loginWith = async (page, username, password) => {
  await page.goto('/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.getByRole('link', { name: title })).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post(`${backendUrl}/api/testing/reset`)
    await request.post(`${backendUrl}/api/users`, { data: user })
    await page.goto('/')
  })

  test('Blog list is shown by default', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
  })

  test('Login form is shown at login route', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password)

      await expect(page.locator('span').filter({ hasText: `${user.name} logged in` })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, user.username, 'wrong')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText(`${user.name} logged in`)).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright creates a blog', 'E2E Author', 'https://example.com/e2e')

      await expect(page.getByRole('link', { name: 'Playwright creates a blog' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable blog', 'E2E Author', 'https://example.com/likes')

      await page.getByRole('link', { name: 'Likeable blog' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the user who added a blog can delete it', async ({ page }) => {
      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })

      await createBlog(page, 'Blog to remove', 'E2E Author', 'https://example.com/remove')

      await page.getByRole('link', { name: 'Blog to remove' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('link', { name: 'Blog to remove' })).not.toBeVisible()
    })

    test('only the creator sees the remove button', async ({ page, request }) => {
      await request.post(`${backendUrl}/api/users`, { data: anotherUser })
      await createBlog(page, 'Creator only removal', 'E2E Author', 'https://example.com/owner')

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, anotherUser.username, anotherUser.password)

      await page.getByRole('link', { name: 'Creator only removal' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})
