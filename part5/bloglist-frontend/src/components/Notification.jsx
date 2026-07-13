import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Alert severity={notification.type} sx={{ mt: 2, mb: 2 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification
