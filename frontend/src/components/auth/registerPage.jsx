import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import { useAuth } from './authContext';
import SnackbarAlert from '../../components-test/SnackbarAlert';

const CustomLink = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

CustomLink.displayName = 'CustomLink';

export function Register () {
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseError = () => {
    setOpenError(false);
  };

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setOpenError(true);
    } else {
      try {
        const response = await fetch('http://localhost:5005/user/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
          const data = await response.json();
          // Assuming the token is in the response data
          const token = data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('email', email);
          login();
          navigate('/');
        } else {
          const data = await response.json();
          setErrorMessage(data.error);
          setOpenError(true);
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred');
        setOpenError(true);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="confirm-password"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                autoComplete="new-confirm-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container flexDirection="row" justifyContent="center">
            <Grid item>
              <MuiLink
                component={CustomLink}
                to="/login"
                variant="body2"
                color="inherit"
              >
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <SnackbarAlert
        open={openError}
        onClose={handleCloseError}
        message={errorMessage}
        severity="error"
      />
    </Container>
  );
}
