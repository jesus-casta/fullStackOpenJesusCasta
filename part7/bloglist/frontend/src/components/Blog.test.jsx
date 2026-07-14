import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'
import useBlogStore from '../stores/blogStore'
import useUserStore from '../stores/userStore'

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

const renderBlog = (user) => {
  useUserStore.setState({ user })
  useBlogStore.setState({
    updateBlog: vi.fn(),
    removeBlog: vi.fn(),
    addComment: vi.fn(),
  })

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>
  )
}

test('renders blog information to unauthenticated users without action buttons', () => {
  renderBlog(null)

  expect(screen.getByText('Component testing')).toBeDefined()
  expect(screen.getByText('by Test Author')).toBeDefined()
  expect(screen.getByText('https://example.com/component-testing')).toBeDefined()
  expect(screen.getByText('likes 4')).toBeDefined()
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated user who is not creator sees only like button', () => {
  renderBlog({ username: 'mluukkai', name: 'Matti Luukkainen' })

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('blog creator sees like and remove buttons', () => {
  renderBlog({ username: 'root', name: 'Superuser' })

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})

test('clicking like button twice calls event handler twice', async () => {
  const user = userEvent.setup()
  const updateBlog = vi.fn()
  useUserStore.setState({ user: { username: 'root', name: 'Superuser' } })
  useBlogStore.setState({
    updateBlog,
    removeBlog: vi.fn(),
    addComment: vi.fn(),
  })

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>
  )

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})
