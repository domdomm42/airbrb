import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Logo from './logo.jsx';
import { useAuth } from '../components/auth/authContext.jsx';

const Navbar = () => {
  // Check if the user is logged in based on the presence of the token
  const { isLoggedIn, logout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Logo />
          <div style={{ marginLeft: 'auto' }}>
            {/* Conditionally render login, signup, or logout button based on the user's login status */}
            {isLoggedIn
              ? (
              <>
                <Button color="inherit" component={RouterLink} to="/mylistings">
                  My Listings
                </Button>
                <Button color="inherit" component={RouterLink} to="/hostedListings">
                  Hosted Listings
                </Button>
                <Button color="inherit" component={RouterLink} to="/">
                  All Listings
                </Button>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
                )
              : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Sign Up
                </Button>
              </>
                )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
