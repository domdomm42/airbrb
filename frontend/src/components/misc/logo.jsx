import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CottageIcon from '@mui/icons-material/Cottage';
import { Link as RouterLink } from 'react-router-dom';

const Logo = () => {
  return (
    <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', color: '#fff', textDecoration: 'None' }}>
      <CottageIcon sx={{ fontSize: '2rem', marginRight: '0.5rem', marginBottom: '0.2rem' }} />
      <Typography
        variant="h5"
        noWrap
        component="div"
        sx={{ fontWeight: 'bold', fontFamily: 'cursive', marginBottom: '0.1rem' }}
      >
        AIRBRB
      </Typography>
    </Box>
  );
};

export default Logo;
