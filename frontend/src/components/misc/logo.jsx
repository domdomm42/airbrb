import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FlightIcon from '@mui/icons-material/Flight';

const Logo = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
      <FlightIcon sx={{ fontSize: '2rem', marginRight: '0.5rem', marginBottom: '0.2rem' }} />
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
