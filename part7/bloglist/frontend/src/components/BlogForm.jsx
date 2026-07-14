import PropTypes from 'prop-types'
import { Button, Stack, TextField } from '@mui/material'
import { useField } from '../hooks'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const addBlog = async (event) => {
    event.preventDefault()

    await createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })

    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <form onSubmit={addBlog}>
      <Stack spacing={2} sx={{ maxWidth: 480 }}>
        <TextField
          label="title"
          {...title.input}
        />
        <TextField
          label="author"
          {...author.input}
        />
        <TextField
          label="url"
          {...url.input}
        />
        <Button type="submit" variant="contained">
          create
        </Button>
      </Stack>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
