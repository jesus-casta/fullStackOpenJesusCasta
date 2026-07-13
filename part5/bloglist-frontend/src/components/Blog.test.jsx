import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing',
  author: 'Test Author',
  url: 'https://example.com/component-testing',
  likes: 4,
  user: {
    username: 'root',
    name: 'Superuser',
    id: '123',
  },
}

test('renders blog information to unauthenticated users without action buttons', () => {
  render(
    <Blog
      blog={blog}
      currentUser={null}
      updateBlog={() => {}}
      removeBlog={() => {}}
    />
  )

  expect(screen.getByText('Component testing')).toBeDefined()
  expect(screen.getByText('by Test Author')).toBeDefined()
  expect(screen.getByText('https://example.com/component-testing')).toBeDefined()
  expect(screen.getByText('likes 4')).toBeDefined()
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated user who is not creator sees only like button', () => {
  render(
    <Blog
      blog={blog}
      currentUser={{ username: 'mluukkai', name: 'Matti Luukkainen' }}
      updateBlog={() => {}}
      removeBlog={() => {}}
    />
  )

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('blog creator sees like and remove buttons', () => {
  render(
    <Blog
      blog={blog}
      currentUser={{ username: 'root', name: 'Superuser' }}
      updateBlog={() => {}}
      removeBlog={() => {}}
    />
  )

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})

test('clicking like button twice calls event handler twice', async () => {
  const user = userEvent.setup()
  const updateBlog = vi.fn()

  render(
    <Blog
      blog={blog}
      currentUser={{ username: 'root', name: 'Superuser' }}
      updateBlog={updateBlog}
      removeBlog={() => {}}
    />
  )

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})
