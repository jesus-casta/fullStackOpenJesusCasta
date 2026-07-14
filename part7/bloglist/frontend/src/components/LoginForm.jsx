import PropTypes from 'prop-types'
import { Button, Stack, TextField } from '@mui/material'
import { useField } from '../hooks'

const LoginForm = ({ handleLogin }) => {
  const username = useField('text')
  const password = useField('password')

  const login = async (event) => {
    event.preventDefault()
    await handleLogin(username.value, password.value)
    username.reset()
    password.reset()
  }

  return (
    <form onSubmit={login}>
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <TextField
          label="username"
          {...username.input}
          name="Username"
        />
        <TextField
          label="password"
          {...password.input}
          name="Password"
        />
        <Button type="submit" variant="contained">
          login
        </Button>
      </Stack>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm
