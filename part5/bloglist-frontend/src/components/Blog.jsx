import PropTypes from 'prop-types'
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

const Blog = ({ blog, currentUser, updateBlog, removeBlog }) => {
  const handleLike = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    })
  }

  const handleRemove = () => {
    removeBlog(blog)
  }

  if (!blog) {
    return null
  }

  const userOwnsBlog = currentUser && blog.user?.username === currentUser.username

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
  blog: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
}

export default Blog
