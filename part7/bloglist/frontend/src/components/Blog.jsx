import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useField } from '../hooks'
import useBlogStore from '../stores/blogStore'
import useNotificationStore from '../stores/notificationStore'
import useUserStore from '../stores/userStore'

const Blog = ({ blog }) => {
  const navigate = useNavigate()
  const comment = useField('text')
  const currentUser = useUserStore((state) => state.user)
  const updateBlog = useBlogStore((state) => state.updateBlog)
  const removeBlog = useBlogStore((state) => state.removeBlog)
  const addComment = useBlogStore((state) => state.addComment)
  const showNotification = useNotificationStore((state) => state.showNotification)
  
  if (!blog) {
    return null
  }

  const userOwnsBlog = currentUser && blog.user?.username === currentUser.username
  
  const handleLike = async () => {
    try {
      await updateBlog({
        ...blog,
        likes: blog.likes + 1,
        user: blog.user?.id || blog.user,
      })
    } catch (error) {
      const message = error.response?.data?.error || 'updating blog failed'
      showNotification(message, 'error')
    }
  }

  const handleRemove = async () => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (!confirmed) {
      return
    }

    try {
      await removeBlog(blog)
      showNotification(`removed ${blog.title}`)
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.error || 'removing blog failed'
      showNotification(message, 'error')
    }
  }

  const handleComment = async (event) => {
    event.preventDefault()

    if (!comment.value.trim()) {
      return
    }

    try {
      await addComment(blog, comment.value)
      showNotification('comment added')
      comment.reset()
    } catch (error) {
      const message = error.response?.data?.error || 'adding comment failed'
      showNotification(message, 'error')
    }
  }

  return (
    <Card className="blog" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>
        <Typography>
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
          <Typography>likes {blog.likes}</Typography>
          {currentUser && (
            <Button variant="contained" size="small" onClick={handleLike}>
              like
            </Button>
          )}
        </Stack>
        <Typography sx={{ mt: 2 }}>
          added by {blog.user?.name || 'unknown user'}
        </Typography>
        {userOwnsBlog && (
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleRemove}
          >
            remove
          </Button>
        )}
        <Typography variant="h5" component="h3" sx={{ mt: 3 }}>
          comments
        </Typography>
        <form onSubmit={handleComment}>
          <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
            <TextField size="small" label="comment" {...comment.input} />
            <Button type="submit" variant="contained">
              add comment
            </Button>
          </Stack>
        </form>
        <ul>
          {(blog.comments || []).map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export const BlogListItem = ({ blog }) => {
  return (
    <div className="blog">
      {blog.title} {blog.author}
    </div>
  )
}

BlogListItem.propTypes = {
  blog: PropTypes.object.isRequired,
}

Blog.propTypes = {
  blog: PropTypes.object,
}

export default Blog
