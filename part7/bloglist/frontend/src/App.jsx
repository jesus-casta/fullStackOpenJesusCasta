import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom'
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
import BlogForm from './components/BlogForm'
import ErrorBoundary from './components/ErrorBoundary'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import useBlogStore from './stores/blogStore'
import useNotificationStore from './stores/notificationStore'
import useUserStore from './stores/userStore'
import userService from './services/users'

const BlogList = () => {
  const blogs = useBlogStore((state) => state.blogs)

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
            {blogs.map((blog) => (
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

const UsersView = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>user</TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const UserView = () => {
  const [users, setUsers] = useState([])
  const { id } = useParams()

  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])

  const user = users.find((item) => item.id === id)

  if (!user) {
    return null
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        {user.name}
      </Typography>
      <Typography variant="h6" component="h2">
        added blogs
      </Typography>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </Box>
  )
}

const NotFound = () => (
  <Box>
    <Typography variant="h4" component="h1">
      Page not found
    </Typography>
    <Typography sx={{ mt: 1 }}>
      The page you tried to open does not exist.
    </Typography>
  </Box>
)

const App = () => {
  const user = useUserStore((state) => state.user)
  const initializeUser = useUserStore((state) => state.initializeUser)
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)
  const blogs = useBlogStore((state) => state.blogs)
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)
  const createBlog = useBlogStore((state) => state.createBlog)
  const showNotification = useNotificationStore((state) => state.showNotification)
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((item) => item.id === match.params.id) : null

  useEffect(() => {
    initializeUser()
    initializeBlogs()
  }, [initializeUser, initializeBlogs])

  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await login(username, password)
      showNotification(`${loggedUser.name} logged in`)
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    showNotification('logged out')
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const createdBlog = await createBlog(blogObject)
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.error || 'creating blog failed'
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
          <Button color="inherit" component={Link} to="/users" sx={navButtonStyle}>
            users
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

      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          <Route
            path="/create"
            element={
              user ? (
                <Box>
                  <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    create new blog
                  </Typography>
                  <BlogForm createBlog={handleCreateBlog} />
                </Box>
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate replace to="/" />
              ) : (
                <Box>
                  <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    Log in to application
                  </Typography>
                  <LoginForm handleLogin={handleLogin} />
                </Box>
              )
            }
          />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/users" element={<UsersView />} />
          <Route path="/" element={<BlogList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
