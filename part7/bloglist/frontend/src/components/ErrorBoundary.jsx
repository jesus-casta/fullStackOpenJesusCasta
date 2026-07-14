import { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Box, Button, Typography } from '@mui/material'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error">
            <Typography variant="h6" component="div">
              Something went wrong
            </Typography>
            <Typography>
              The page could not be rendered. Try returning to the blog list.
            </Typography>
            <Button sx={{ mt: 1 }} href="/">
              back to blogs
            </Button>
          </Alert>
        </Box>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
