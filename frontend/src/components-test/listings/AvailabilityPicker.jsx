// AvailabilityPicker.jsx
import React from 'react';
import { Box, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const AvailabilityPicker = ({ item, index, handleDateChange }) => {
  return (
    <>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={`Start Date ${index + 1}`}
              value={item.start}
              onChange={(date) => handleDateChange(date, index, 'start')}
              textField={(props) => <TextField {...props} InputLabelProps={{ shrink: true }} />}
            />
          </LocalizationProvider>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={`End Date ${index + 1}`}
              value={item.end}
              onChange={(date) => handleDateChange(date, index, 'end')}
              textField={(props) => <TextField {...props} InputLabelProps={{ shrink: true }} />}
            />
          </LocalizationProvider>
        </Box>
      </Grid>
    </>
  );
};

export default AvailabilityPicker;
