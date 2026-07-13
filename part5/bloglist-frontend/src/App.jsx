import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const BlogList = ({ blogs }) => {
  const blogsToShow = [...blogs].sort((first, second) => second.likes - first.likes)

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        blogs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell>author</TableCell>
              <TableCell>likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogsToShow.map((blog) => (
              <TableRow className="blog" key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell>{blog.likes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`${user.name} logged in`)
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
    showNotification('logged out')
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(createdBlog))
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.error || 'creating blog failed'
      showNotification(message, 'error')
    }
  }

  const updateBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, blog)

      setBlogs(blogs.map((currentBlog) =>
        currentBlog.id === updatedBlog.id ? updatedBlog : currentBlog
      ))
    } catch (error) {
      const message = error.response?.data?.error || 'updating blog failed'
      showNotification(message, 'error')
    }
  }

  const removeBlog = async (blog) => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (!confirmed) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((currentBlog) => currentBlog.id !== blog.id))
      showNotification(`removed ${blog.title}`)
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.error || 'removing blog failed'
      showNotification(message, 'error')
    }
  }

  const navButtonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }

  return (
    <Container maxWidth="md">
      <AppBar position="static" sx={{ mt: 2, mb: 3 }}>
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={navButtonStyle}>
            blogs
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/create" sx={navButtonStyle}>
              create
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <>
              <Typography component="span" sx={{ mr: 2 }}>
                {user.name} logged in
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login" sx={navButtonStyle}>
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              currentUser={user}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
            />
          }
        />
        <Route
          path="/create"
          element={
            user
              ? (
                <Box>
                  <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    create new blog
                  </Typography>
                  <BlogForm createBlog={createBlog} />
                </Box>
              )
              : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            user
              ? <Navigate replace to="/" />
              : (
                <Box>
                  <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    Log in to application
                  </Typography>
                  <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleLogin={handleLogin}
                  />
                </Box>
              )
          }
        />
        <Route path="/" element={<BlogList blogs={blogs} />} />
      </Routes>
    </Container>
  )
}

export default App
