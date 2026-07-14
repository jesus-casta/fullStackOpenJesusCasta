import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with right details', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title'), 'Testing forms')
  await user.type(screen.getByLabelText('author'), 'Form Author')
  await user.type(screen.getByLabelText('url'), 'https://example.com/forms')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms',
    author: 'Form Author',
    url: 'https://example.com/forms',
  })
})
