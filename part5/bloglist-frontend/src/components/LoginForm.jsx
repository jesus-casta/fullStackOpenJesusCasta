import PropTypes from 'prop-types'
import { Button, Stack, TextField } from '@mui/material'

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleLogin,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <TextField
          label="username"
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
        />
        <TextField
          label="password"
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
        <Button type="submit" variant="contained">
          login
        </Button>
      </Stack>
    </form>
  )
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm
