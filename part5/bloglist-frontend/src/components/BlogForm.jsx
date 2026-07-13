import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Stack, TextField } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <Stack spacing={2} sx={{ maxWidth: 480 }}>
        <TextField
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
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
